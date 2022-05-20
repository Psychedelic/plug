import { Principal } from '@dfinity/principal';
import { validatePrincipalId, validateAccountId } from './ids';
import { getContacts, setContacts } from '@modules/storageManager';
import { addContact } from '@background/Keyring';

export const createValueObj = (currentId) => {
  if (validatePrincipalId(currentId)) {
    return { 'PrincipalId': currentId };
  }

  if (validateAccountId(currentId)) {
    return { 'AccountId': currentId };
  }

  return { 'Icns': currentId };
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
  } = contact

  let [id] = Object.values(unparsedValue);

  return {
    id,
    image,
    name,
  };
};

export const syncContactsToDab = async () => {
  return new Promise((resolve, reject) => {
    const parseAndSyncContacts = async (contacts) => {
      resolve(Promise.all(contacts.map(async (contact) => {
        const parsedContact = buildContactObject(contact);

        return await addContact(parsedContact).then((res) => {
          if (res === true) {
            const filteredContacts = contacts.filter(c => c.id === currentId);
            setContacts(filteredContacts);
          }
        });
      })));
    };

    getContacts(parseAndSyncContacts);
  });
};
