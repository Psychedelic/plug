import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const StorageContext = React.createContext();
export const StorageUpdateContext = React.createContext();

const ICON_KEY = 'icon';

const Storage = ({ storage, children }) => {
  const [storageState, setStorageState] = useState(null);

  const handleSetStorage = (icon) => storage.local.set({
    [ICON_KEY]: icon,
  });

  useEffect(() => {
    storage.onChanged.addListener((changeObject) => {
      if (changeObject[ICON_KEY]) {
        setStorageState(changeObject[ICON_KEY].newValue);
      }
    });

    storage.local.get([ICON_KEY], (state) => {
      if (state[ICON_KEY]) {
        setStorageState(state[ICON_KEY]);
      }
    });
  }, []);

  return (
    <StorageContext.Provider value={storageState}>
      <StorageUpdateContext.Provider value={handleSetStorage}>
        {children}
      </StorageUpdateContext.Provider>
    </StorageContext.Provider>
  );
};

export const storagePropType = {
  onChanged: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  local: PropTypes.shape({
    set: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
  }).isRequired,
};

Storage.defaultProps = {
  children: null,
};

Storage.propTypes = {
  children: PropTypes.node,
  storage: PropTypes.shape(storagePropType).isRequired,
};

export default Storage;
