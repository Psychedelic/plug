import { useDispatch } from 'react-redux';
import { getContacts as getReduxContacts } from '@redux/contacts';
import { getDabContacts } from '@modules/storageManager';

const useContacts = () => {
  const dispatch = useDispatch();

  const getContacts = (refresh = false) => {
    getDabContacts((contactList) => {
      dispatch(getReduxContacts({
        localContacts: contactList,
        refresh,
      }));
    });
  };

  return {
    getContacts,
  };
};

export default useContacts;
