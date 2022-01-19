import { useEffect, useState } from 'react';
import { getContacts, setContacts as setStorageContacts } from '@modules/storageManager';

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

export default useContacts;
