import { useEffect, useState } from 'react';
import extension from 'extensionizer';

const getFirstLetterFrom = (value) => value.slice(0, 1).toUpperCase();

const storage = extension.storage.local;

const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [groupedContacts, setGroupedContacts] = useState([]);

  const handleAddContact = (contact) => setContacts([...contacts, contact]);
  const handleRemoveContact = (contact) => setContacts(contacts.filter((c) => c.id !== contact.id));

  useEffect(() => {
    storage.get(['contacts'], (state) => {
      const lsContacts = state.contacts;
      if (lsContacts) {
        setContacts(lsContacts);
      }
    });
  }, []);

  useEffect(() => {
    storage.set({
      contacts,
    });

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
