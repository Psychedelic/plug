import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { buildContactObject, parseContactFromDab } from '@utils/contacts';
import {
  setDabContacts as setLocalDabContacts,
} from '@modules/storageManager';
import {
  getContacts as callGetContacts,
  addContact as callAddContact,
  deleteContact as callRemoveContact,
} from '@background/Keyring';

const getFirstLetterFrom = (value) => value.slice(0, 1).toUpperCase();

const getIndexOfContact = (contact, contactList) => {
  let index = -1;
  contactList.forEach((c, i) => {
    if (c.id === contact.id) {
      index = i;
    }
  });

  return index;
};

const filterContactsById = (contacts) => contacts.reduce((acc, c) => {
  if (getIndexOfContact(c, acc) === -1) {
    return [...acc, c];
  }
  return acc;
}, []);

const groupContacts = (contacts) => (
  contacts
    .reduce((list, contact) => {
      const { name } = contact;
      const listItem = list.find(
        (item) => item.letter && item.letter === getFirstLetterFrom(name),
      );
      if (!listItem) {
        list.push({ letter: getFirstLetterFrom(name), contacts: [contact] });
      } else {
        listItem.contacts.push(contact);
      }

      return list;
    }, [])
);

const getContacts = createAsyncThunk(
  'contacts/getContacts',
  async () => {
    const contacts = await callGetContacts();
    return contacts.map(parseContactFromDab);
  },
);

const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact) => {
    const parsedObject = buildContactObject(contact);
    const res = await callAddContact(parsedObject);
    return res;
  },
);

const removeContact = createAsyncThunk(
  'contacts/removeContact',
  async (contact) => {
    const { name } = contact;

    const res = await callRemoveContact(name);
    return res;
  },
);

/* eslint-disable no-param-reassign */
export const contactSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: [],
    groupedContacts: [],
    contactsLoading: false,
  },
  reducers: { },
  extraReducers: (builder) => {
    builder
      .addCase(addContact.pending, (state, action) => {
        const contact = action.meta.arg;
        const newContactList = [...state.contacts, contact];

        setLocalDabContacts(newContactList);

        state.contacts = newContactList;
        state.groupedContacts = groupContacts(newContactList);
      })
      .addCase(addContact.rejected, (state, action) => {
        const contact = action.meta.arg;
        const filteredContacts = state.contacts.filter((c) => c.id === contact.id);

        setLocalDabContacts(filteredContacts);

        state.contacts = filteredContacts;
        state.groupedContacts = groupContacts(filteredContacts);
      })
      .addCase(getContacts.pending, (state, action) => {
        state.contactsLoading = true;
        if (action.meta.arg.refresh) {
          state.contacts = [];
          state.groupedContacts = [];
          setLocalDabContacts([]);
        } else {
          state.contacts = action.meta.arg.localContacts;
          state.groupedContacts = groupContacts(action.meta.arg.localContacts);
        }
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        let newContactList = [...state?.contacts, ...action?.payload, ...action.meta.arg?.localContacts];

        newContactList = filterContactsById(newContactList);
        setLocalDabContacts(newContactList);

        state.contacts = newContactList;
        state.groupedContacts = groupContacts(newContactList);
        state.contactsLoading = false;
      })
      .addCase(removeContact.pending, (state, action) => {
        const contact = action.meta.arg;
        const filteredContacts = state.contacts.filter((c) => c.name !== contact.name);

        setLocalDabContacts(filteredContacts);

        state.contacts = filteredContacts;
        state.groupedContacts = groupContacts(filteredContacts);
      })
      .addCase(removeContact.rejected, (state, action) => {
        const contact = action.meta.arg;

        const newContactList = [...state.contacts, contact];

        setLocalDabContacts(newContactList);

        state.contacts = newContactList;
        state.groupedContacts = groupContacts(newContactList);
      });
  },
});

export { getContacts, addContact, removeContact };

export default contactSlice.reducer;
