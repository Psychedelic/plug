import extension from 'extensionizer';

import { addDisconnectedEntry } from '@shared/utils/apps';

const storage = extension.storage.local;

const secureGetWrapper = (key, defaultValue, cb) => {
  try {
    storage.get(key, cb);
  } catch (e) {
    cb(defaultValue);
  }
};

const secureSetWrapper = (setArguments, defaultValue, cb) => {
  try {
    // Callsback true after setting item
    storage.set(setArguments, () => { cb(true); });
  } catch (e) {
    cb(defaultValue);
  }
};

export const getApps = (walletId, cb) => {
  const defaultValue = {};

  secureGetWrapper(walletId, defaultValue, (state) => (
    cb(state?.[parseInt(walletId, 10)]?.apps || defaultValue)
  ));
};

export const setApps = (walletId, apps, cb = () => {}) => {
  const defaultValue = false;
  secureSetWrapper({ [walletId]: { apps } }, defaultValue, cb);
};

export const updateApp = (walletId, app = {}) => {
  getApps(walletId, (apps = {}) => {
    const prevApp = apps[app?.url] || { events: [] };
    const newApp = { ...prevApp, ...app, events: [...prevApp?.events, ...(app?.events || [])] };
    const newApps = {
      ...apps,
      [app?.url]: newApp,
    };
    setApps(walletId, newApps);
  });
};

export const removeApp = (walletId, appUrl, cb = () => {}) => {
  const defaultValue = false;

  getApps(walletId, (apps) => {
    if (apps?.[appUrl]) {
      const newApps = addDisconnectedEntry({ apps, appUrl });
      setApps(walletId, newApps, cb);
    } else {
      cb(defaultValue);
    }
  });
};

export const setRouter = (route, cb = () => {}) => {
  const defaultValue = false;

  secureSetWrapper({ router: route }, defaultValue, cb);
};

export const getContacts = (cb) => {
  const defaultValue = [];

  secureGetWrapper(['contacts'], defaultValue, (state) => {
    cb(state?.contacts || defaultValue);
  });
};

export const setContacts = (contacts, cb = () => {}) => {
  const defaultValue = false;

  secureSetWrapper({ contacts }, defaultValue, cb);
};

export const setHiddenAccounts = (hiddenAccounts, cb = () => {}) => {
  const defaultValue = false;

  secureSetWrapper({ hiddenAccounts }, defaultValue, cb);
};

export const getHiddenAccounts = (cb) => {
  const defaultValue = {};

  secureGetWrapper('hiddenAccounts', defaultValue, (state) => {
    cb(state?.hiddenAccounts || defaultValue);
  });
};

export const getAppsKey = (cb) => {
  const defaultValue = {};

  secureGetWrapper('apps', defaultValue, (result) => {
    cb(result || defaultValue);
  });
};

export const clearStorage = (cb = () => {}) => {
  try {
    storage.clear(cb(true));
  } catch (e) {
    cb(false);
  }
};

export const getLastClockCheck = (cb) => {
  const defaultValue = '';

  secureGetWrapper('lastClockCheck', defaultValue, (result) => {
    cb(result?.lastClockCheck || defaultValue);
  });
};

export const setLastClockCheck = () => {
  const currentDate = new Date().toUTCString();

  secureSetWrapper({ lastClockCheck: currentDate }, currentDate, () => {});
};
