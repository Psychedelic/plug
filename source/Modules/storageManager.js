import extension from 'extensionizer';

import { addDisconnectedEntry } from '@shared/utils/apps';

const storage = extension.storage.local;

export const getApps = (currentWalletId, cb) => {
  storage.get(currentWalletId, (state) => {
    cb(state?.[parseInt(currentWalletId, 10)]?.apps);
  });
};

export const setApps = (currentWalletId, apps) => {
  storage.set({ [currentWalletId]: { apps } });
};

export const removeApp = (currentWalletId, appUrl, cb) => {
  let newApps;

  getApps(currentWalletId, (apps) => {
    if (apps?.[appUrl]) {
      newApps = addDisconnectedEntry({ apps, appUrl });
      setApps(currentWalletId, newApps);
      cb(true);
    } else {
      cb(false);
    }
  });
};

export const setRouter = (route) => {
  storage.set({ router: route });
};

export const getContacts = (cb) => {
  storage.get(['contacts'], (state) => {
    cb(state.contacts);
  });
};

export const setContacts = (contacts) => {
  storage.set({ contacts });
};

export const setHiddenAccounts = (hiddenAccounts) => {
  storage.set({ hiddenAccounts });
};

export const getHiddenAccounts = (cb) => {
  storage.get('hiddenAccounts', (state) => {
    cb(state.hiddenAccounts);
  });
};

export const getAppsKey = (cb) => {
  storage.get('apps', cb);
};

export const clearStorage = () => {
  storage.clear();
};
