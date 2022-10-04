import extension from 'extensionizer';
import { v4 as uuidv4 } from 'uuid';

import { addDisconnectedEntry } from '@shared/utils/apps';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';

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
    // Callback true after setting item
    storage.set(setArguments, () => { cb(true); });
  } catch (e) {
    cb(defaultValue);
  }
};

export const getApps = (currentWalletId, cb) => {
  const defaultValue = {};

  secureGetWrapper(currentWalletId, defaultValue, (state) => (
    cb(state?.[currentWalletId]?.apps || defaultValue)
  ));
};

export const getApp = (currentWalletId, appUrl, cb) => {
  const defaultValue = {};

  secureGetWrapper(currentWalletId, defaultValue, (state) => {
    cb(state?.[currentWalletId]?.apps?.[appUrl] || defaultValue);
  });
};

export const setApps = (currentWalletId, apps, cb = () => { }) => {
  const defaultValue = false;

  secureSetWrapper({ [currentWalletId]: { apps } }, defaultValue, cb);
};

export const removeApp = (currentWalletId, appUrl, cb = () => { }) => {
  const defaultValue = false;
  getApps(currentWalletId, (apps) => {
    if (apps?.[appUrl]?.status === CONNECTION_STATUS.accepted) {
      const newApps = addDisconnectedEntry({ apps, appUrl });
      setApps(currentWalletId, newApps, cb);
    } else {
      cb(defaultValue);
    }
  });
};

export const setRouter = (route, cb = () => { }) => {
  const defaultValue = false;

  secureSetWrapper({ router: route }, defaultValue, cb);
};

export const getContacts = (cb) => {
  const defaultValue = [];

  secureGetWrapper(['contacts'], defaultValue, (state) => {
    cb(state?.contacts || defaultValue);
  });
};

export const setContacts = (contacts, cb = () => { }) => {
  const defaultValue = false;

  secureSetWrapper({ contacts }, defaultValue, cb);
};

export const setHiddenAccounts = (hiddenAccounts, cb = () => { }) => {
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

export const clearStorage = (cb = () => { }) => {
  try {
    storage.clear(cb(true));
  } catch (e) {
    cb(false);
  }
};

export const setProtectedIds = (protectedIds = [], cb = () => { }) => {
  secureSetWrapper({ protectedIds }, [], cb);
};

export const getProtectedIds = (cb) => {
  const defaultValue = [];

  secureGetWrapper('protectedIds', defaultValue, (state) => {
    cb(state?.protectedIds || defaultValue);
  });
};

export const setUseICNS = (useICNS, walletNumber, cb = () => {}) => {
  const defaultValue = true;

  secureGetWrapper('icns', defaultValue, (state) => {
    cb(state?.icns?.[walletNumber] ?? defaultValue);
    secureSetWrapper({
      icns: {
        ...state?.icns,
        [walletNumber]: useICNS,
      },
    }, defaultValue, cb);
  });
};

export const getUseICNS = (walletNumber, cb) => {
  const defaultValue = true;
  secureGetWrapper('icns', defaultValue, (state) => {
    cb(state?.icns?.[walletNumber] ?? defaultValue);
  });
};

export const setBatchTransactions = (batchTransactions = {}, cb = () => ({})) => {
  secureSetWrapper({ batchTransactions }, {}, cb);
};

export const getBatchTransactions = (cb) => {
  const defaultValue = {};

  secureGetWrapper('batchTransactions', defaultValue, (state) => {
    cb(state?.batchTransactions || defaultValue);
  });
};

export const getWalletsConnectedToUrl = (url, walletIds, cb) => {
  const wallets = [];
  if (!walletIds.length) {
    cb([]);
    return;
  }

  walletIds.forEach((id, index) => {
    getApp(id.toString(), url, (app = {}) => {
      if (app?.status === CONNECTION_STATUS.accepted) {
        wallets.push(id);
      }
      if (index === walletIds.length - 1) {
        cb(wallets);
      }
    });
  });
};

export const getDabContacts = (cb) => {
  const defaultValue = [];

  secureGetWrapper('dabContacts', defaultValue, (state) => {
    cb(state?.dabContacts || defaultValue);
  });
};

export const setDabContacts = (dabContacts = [], cb = () => ([])) => {
  secureSetWrapper({ dabContacts }, [], cb);
};

export const createPendingTransaction = (cb) => {
  const id = uuidv4();
  secureSetWrapper({ activeTransactions: { [id]: 'pending' } }, {}, () => cb(id));
};
export const checkPendingTransaction = (transactionId, cb) => {
  secureGetWrapper('activeTransactions', 'pending', (entry) => {
    cb(entry.activeTransactions[transactionId]);
  });
};

export const reviewPendingTransaction = async (transactionId) => {
  const setData = () => new Promise((resolve) => {
    secureSetWrapper({ activeTransactions: { [transactionId]: 'reviewed' } }, {}, resolve);
  });
  const result = await setData();
  return result;
};
export const removePendingTransaction = (transactionId, cb) => {
  secureSetWrapper({ activeTransactions: { [transactionId]: undefined } }, {}, cb);
};

export const resetPendingTransactions = () => {
  secureSetWrapper({ activeTransactions: { } }, {}, () => {});
};

export const updateWalletId = (previousWalletId, newWalletId) => {
  getApps(previousWalletId, (apps) => {
    setApps(newWalletId, apps);
  });
  getUseICNS(previousWalletId, (result) => {
    setUseICNS(newWalletId, result);
  });
};
