import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createValueObj, buildContactObject, parseContactFromDab } from '@shared/utils/contacts';
import {
  getContacts as callGetContacts,
  addContact as callAddContact,
  deleteContact as callRemoveContact,
} from '@background/Keyring';

const getFirstLetterFrom = (value) => value.slice(0, 1).toUpperCase();

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
  async (clearList = false) => {
    const contacts = await callGetContacts();
    return contacts.map(parseContactFromDab);
  }
);

const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact) => {
    const parsedObject = buildContactObject(contact);
    const res = await callAddContact(parsedObject);
    return res;
  }
);

const removeContact = createAsyncThunk(
  'contacts/removeContact',
  async (contact) => {
    const { name } = contact;

    const res = await callRemoveContact(name);
    return res;
  }
);

/* eslint-disable no-param-reassign */
export const contactSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: [],
    groupedContacts: [],
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
        if (action.meta.arg) {
          state.contacts = [];
          state.groupedContacts = [];
        }
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
        state.groupedContacts = groupContacts(action.payload);
      })
      .addCase(removeContact.pending, (state, action) => {
        const contact = action.meta.arg;
        const filteredContacts = state.contacts.filter((c) => c.name !== contact.name);

        state.contacts = filteredContacts;
        state.groupedContacts = groupContacts(filteredContacts);
      })
      .addCase(removeContact.rejected, (state, action) => {
        const contact = action.meta.arg;

        const newContactList = [...state.contacts, contact];

        state.contacts = newContactList;
        state.groupedContacts = groupContacts(newContactList);
      })
  },
});

export { getContacts, addContact, removeContact };

export default contactSlice.reducer;
