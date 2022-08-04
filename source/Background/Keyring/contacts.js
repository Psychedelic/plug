import { HANDLER_TYPES, sendMessage } from './index';

export const getContacts = () => new Promise((resolve, reject) => {
  sendMessage({
    type: HANDLER_TYPES.GET_CONTACTS,
  }, (contactList) => {
    if (contactList) return resolve(contactList);
    return reject(contactList);
  });
});

export const addContact = (contact) => new Promise((resolve) => {
  sendMessage({
    type: HANDLER_TYPES.ADD_CONTACT,
    params: contact,
  }, (res) => {
    resolve(res);
  });
});

export const deleteContact = (contactName) => new Promise((resolve) => {
  sendMessage({
    type: HANDLER_TYPES.REMOVE_CONTACT,
    params: contactName,
  }, (res) => {
    resolve(res);
  });
});
