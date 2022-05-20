import { useEffect, useState } from 'react';
import {
  getContacts,
  setContacts as setStorageContacts,
} from '@modules/storageManager';

import { createValueObj, buildContactObject, parseContactFromDab } from '@shared/utils/contacts';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

const getFirstLetterFrom = (value) => value.slice(0, 1).toUpperCase();

const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [groupedContacts, setGroupedContacts] = useState([]);

  const handleAddContact = (contact) => setContacts([...contacts, contact]);
  const handleRemoveContact = (contact) => setContacts(contacts.filter((c) => c.id !== contact.id));

  useEffect(() => {
    // storageManager getContacts
    getContacts((lsContacts) => {
      if (lsContacts) {
        setContacts(lsContacts);
      }
    });
  }, []);

  useEffect(() => {
    setStorageContacts(contacts);

    setGroupedContacts(contacts
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
      }, []));
  }, [contacts]);

  return {
    contacts: groupedContacts, handleAddContact, handleRemoveContact, ungroupedContacts: contacts,
  };
};

/////////////////////////////////////////////////////

const addContact = (parsedContact) => {
  return new Promise((resolve, reject) => {
    sendMessage({
      type: HANDLER_TYPES.ADD_CONTACT,
      params: parsedContact,
    }, (res) => {
      if (res) return resolve(res);
      return reject(res);
    });
  });
};

const removeContact = (contact) => {
  return new Promise((resolve, reject) => {
    sendMessage({
      type: HANDLER_TYPES.REMOVE_CONTACT,
      params: contact.name,
    }, (res) => {
      if (res) return resolve(res);
      return reject(res);
    });
  });
};

const useContactList = () => {
  const [contacts, setContacts] = useState([]);
  const filterContacts = (contact) => contacts.filter(c => c.name === contact.name);

  const handleAddContact = async (contact) => {
    setContacts([...contacts, contact]);

    const parsedContact = buildContactObject(contact);
    const contactAdded = await addContact(parsedContact);
    if (!contactAdded) setContacts(filterContacts(contact));

    return contactAdded;
  };

  const handleRemoveContact = async (contact) => {
    const newContacts = filterContacts(contact);
    setContacts(newContacts);

    const contactRemoved = await removeContact(contact);
    if (!contactRemoved) setContacts([...contacts, contact]);
  };

  const handleEditContact = async (oldContact, newContact) => {
    const removedContact = await handleRemoveContact(oldContact)
    if (removeContact) handleAddContact(newContact);
  };

  const updateContacts = () => {
    sendMessage({
      type: HANDLER_TYPES.GET_CONTACTS,
    }, (contactList) => {
      const parsedContactList = contactList.map(parseContactFromDab);
      console.log('Setting contacts ->', parsedContactList);
      setContacts(parsedContactList);
    });
  };

  const syncContactsFromStorage = () => {
    const parseAndSyncContacts = (storageContacts) => {
      if (storageContacts.length) {
        storageContacts.map(async (contact) => {
          const added = await handleAddContact(contact)
          if (!added) {
            const filteredContacts = storageContacts.filter(c => c.id === contact.id);
            setStorageContacts(filteredContacts);
          }
        });
        updateContacts();
      }
    };
    getContacts(parseAndSyncContacts);
  };

  const validContactName = (contact) => {
    const { name } = contact;
    return contacts.find(c => c.name === contact.name) === undefined;
  }

  return {
    contacts,
    updateContacts,
    syncContactsFromStorage,
    validContactName,
    handleEditContact,
    handleAddContact,
    handleRemoveContact,
  };
};

export default useContactList;
