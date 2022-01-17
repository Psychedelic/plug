import extension from 'extensionizer';

import { addDisconnectedEntry } from '@shared/utils/apps';

const storage = extension.storage.local;

export const getApps = (currentWalletId, cb) => {
  try {
    storage.get(currentWalletId, (state) => {
      cb(state?.[parseInt(currentWalletId, 10)]?.apps || {});
    });
  } catch (e) {
    cb({});
  }
};

export const setApps = (currentWalletId, apps) => {
  storage.set({ [currentWalletId]: { apps } });
};

export const removeApp = (currentWalletId, appUrl, cb) => {
  try {
    getApps(currentWalletId, (apps) => {
      if (apps?.[appUrl]) {
        const newApps = addDisconnectedEntry({ apps, appUrl });
        setApps(currentWalletId, newApps);
        cb(true);
      } else {
        cb(false);
      }
    });
  } catch (e) {
    cb(false);
  }
};

export const setRouter = (route) => {
  storage.set({ router: route });
};

export const getContacts = (cb) => {
  try {
  storage.get(['contacts'], (state) => {
    cb(state.contacts || []);
  });
  } catch (e) {
    cb([]);
  }
};

export const setContacts = (contacts) => {
  storage.set({ contacts });
};

export const setHiddenAccounts = (hiddenAccounts) => {
  storage.set({ hiddenAccounts });
};

export const getHiddenAccounts = (cb) => {
  try {
    storage.get('hiddenAccounts', (state) => {
      cb(state.hiddenAccounts || {});
    });
  } catch (e) {
    cb({});
  }
};

export const getAppsKey = (cb) => {
  try {
    storage.get('apps', cb);
  } catch (e) {
    cb({});
  }
};

export const clearStorage = () => {
  storage.clear();
};
