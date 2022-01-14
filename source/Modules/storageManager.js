import extension from 'extensionizer';

import { addDisconnectedEntry } from '@shared/utils/apps';

const storage = extension.storage.local;

export const getApps = (currentWalletId, cb) => {
  storage.get(currentWalletId, (state) => {
    cb(state?.[parseInt(currentWalletId)]?.apps);
  });
};

export const setApps = (currentWalletId, apps) => {
  storage.set({ [currentWalletId]: { apps } });
};

export const removeApp = (currentWalletId, appUrl, cb) => {
  let newApps;

  const apps = getApps(currentWalletId, (apps) => {
    if (apps?.[url]) {
      newApps = addDisconnectedEntry({ apps, url });
      setApps(currentWalletId, newApps);
      return cb(true);
    } 

    cb(false);
  });
};

export const setRouter = (route) => {
  storage.set({ router: route });
};

export const getContacts = (cb) =>  {
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
