import { useContext } from 'react';
import { StorageContext, StorageUpdateContext } from '../Storage';

const useStorage = () => {
  const storage = useContext(StorageContext);
  const updateStorage = useContext(StorageUpdateContext);

  return {
    storage,
    updateStorage,
  };
};

export default useStorage;
