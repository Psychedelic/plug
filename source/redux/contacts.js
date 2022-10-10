/* eslint-disable no-underscore-dangle */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { buildContactObject, parseContactFromDab } from '@shared/utils/contacts';
import {
  getContacts as callGetContacts,
  addContact as callAddContact,
  deleteContact as callRemoveContact,
} from '@background/Keyring/contacts';
import { Principal } from '@dfinity/principal';

const getFirstLetterFrom = (value) => value.slice(0, 1).toUpperCase();

const getIndexOfContact = (contact, contactList) => {
  let index = -1;
  const contactItem = contact?.id?._isPrincipal
    ? Principal.from(contact?.id)?.toText()
    : contact;
  contactList.forEach((c, i) => {
    const listItem = c?.id?._isPrincipal
      ? Principal.from(c?.id)?.toText()
      : c;
    if (contactItem.id === listItem.id) {
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
    pendingDelete: false,
  },
  reducers: { },
  extraReducers: (builder) => {
    builder
      .addCase(addContact.pending, (state, action) => {
        const contact = action.meta.arg;
        const newContactList = [...state.contacts, contact];

        state.contacts = newContactList;
        state.groupedContacts = groupContacts(newContactList);
      })
      .addCase(addContact.rejected, (state, action) => {
        const contact = action.meta.arg;
        const filteredContacts = state.contacts.filter((c) => c.id === contact.id);

        state.contacts = filteredContacts;
        state.groupedContacts = groupContacts(filteredContacts);
      })
      .addCase(getContacts.pending, (state, action) => {
        if (action.meta.arg?.refresh) {
          state.contacts = [];
          state.groupedContacts = [];
        }
        state.contactsLoading = true;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        // Doesn't update contact list if removeContact is pending
        if (!state.pendingDelete) {
          let newContactList = [
            ...state?.contacts,
            ...action?.payload,
          ];
          newContactList = filterContactsById(newContactList);

          state.contacts = newContactList;
          state.groupedContacts = groupContacts(newContactList);
        }
        state.contactsLoading = false;
      })
      .addCase(removeContact.pending, (state, action) => {
        const contact = action.meta.arg;
        const filteredContacts = state.contacts.filter((c) => c.name !== contact.name);

        state.pendingDelete = true;
        state.contacts = filteredContacts;
        state.groupedContacts = groupContacts(filteredContacts);
      })
      .addCase(removeContact.fulfilled, (state) => {
        state.pendingDelete = false;
      })
      .addCase(removeContact.rejected, (state, action) => {
        const contact = action.meta.arg;

        const newContactList = [...state.contacts, contact];

        state.pendingDelete = false;
        state.contacts = newContactList;
        state.groupedContacts = groupContacts(newContactList);
      });
  },
});

export { getContacts, addContact, removeContact };

export default contactSlice.reducer;
