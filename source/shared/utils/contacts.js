/* eslint-disable no-underscore-dangle */
import { Principal } from '@dfinity/principal';
import { getContacts, setContacts } from '@modules/storageManager';
import { addContact } from '@background/Keyring';
import { validatePrincipalId, validateAccountId } from './ids';

export const createValueObj = (currentId) => {
  if (validatePrincipalId(currentId)) {
    return { PrincipalId: currentId };
  }

  if (validateAccountId(currentId)) {
    return { AccountId: currentId };
  }

  return { Icns: currentId };
};

export const buildContactObject = (contactData) => {
  const {
    id: currentId,
    image: emoji = [],
    name,
  } = contactData;

  const value = createValueObj(currentId);

  const contact = {
    value,
    emoji: [emoji],
    name,
    description: ['contact description'],
  };

  return contact;
};

export const parseContactFromDab = (contact) => {
  const {
    name,
    emoji: [image],
    value: unparsedValue,
  } = contact;

  const [id] = Object.values(unparsedValue);
  let parsedId = id;

  if (id._isPrincipal) {
    // Converts principal from arr to string
    parsedId = Principal.fromUint8Array(
      new Uint8Array(Object.values(id._arr)),
    ).toString();
  }

  return {
    id: parsedId,
    image,
    name,
  };
};

export const syncContactsToDab = async () => new Promise((resolve) => {
  const parseAndSyncContacts = async (contacts) => {
    resolve(Promise.all(contacts.map(async (contact) => {
      const parsedContact = buildContactObject(contact);

      return addContact(parsedContact).then((res) => {
        if (res === true) {
          const filteredContacts = contacts.filter((c) => c.id !== contact.id);
          setContacts(filteredContacts);
        }
      });
    })));
  };

  getContacts(parseAndSyncContacts);
});
