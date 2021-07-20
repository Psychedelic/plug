import { CURRENCIES } from '@shared/constants/currencies';
import extension from 'extensionizer';

export const E8S_PER_ICP = 100_000_000;
export const NANOS_PER_SECOND = 1_000_000;
export const BALANCE_ERROR = 'You have tried to spend more than the balance of your account';

const recursiveParseBigint = (obj) => Object.entries(obj).reduce(
  (acum, [key, val]) => {
    if (val instanceof Object) {
      const res = Array.isArray(val)
        ? val.map((el) => recursiveParseBigint(el))
        : recursiveParseBigint(val);
      return { ...acum, [key]: res };
    }
    if (typeof val === 'bigint') {
      return { ...acum, [key]: parseInt(val.toString(), 10) };
    }
    return { ...acum, [key]: val };
  },
  { ...obj },
);

const formatAssets = (e8s, icpPrice) => {
  // The result is in e8s and a bigint. We parse it and transform to ICP
  const icpBalance = parseInt(e8s.toString(), 10) / E8S_PER_ICP;
  const assets = [
    {
      image: CURRENCIES.get('ICP').image,
      name: CURRENCIES.get('ICP').name,
      amount: icpBalance,
      value: icpBalance * icpPrice || icpBalance,
      currency: CURRENCIES.get('ICP').value,
    },
  ];
  return assets;
};

export const HANDLER_TYPES = {
  LOCK: 'lock-keyring',
  UNLOCK: 'unlock-keyring',
  CREATE: 'create-keyring',
  IMPORT: 'import-keyring',
  GET: 'get-keyring',
  GET_STATE: 'get-keyring-state',
  GET_TRANSACTIONS: 'get-keyring-transactions',
  GET_ASSETS: 'get-keyring-assets',
  GET_BALANCE: 'get-balance',
  SEND_ICP: 'send-icp',
  EDIT_PRINCIPAL: 'edit-principal',
};

export const sendMessage = (args, callback) => {
  extension.runtime.sendMessage(args, (response) => {
    let parsedResponse = response;
    if (typeof response === 'string') {
      try {
        parsedResponse = JSON.parse(response);
      } catch (error) {
        parsedResponse = response;
      }
    }
    callback(parsedResponse);
  });
};

export const getKeyringHandler = (type, keyring) => ({
  [HANDLER_TYPES.LOCK]: async () => keyring.lock(),
  [HANDLER_TYPES.UNLOCK]: async (params) => {
    let unlocked = false;
    try {
      unlocked = await keyring.unlock(params?.password);

      if (unlocked && params?.redirect) {
        extension.storage.local.set({
          router: 'home',
        });
      }
    } catch (e) {
      unlocked = false;
    }
    return unlocked;
  },
  [HANDLER_TYPES.CREATE]: async (params) => keyring.create(params),
  [HANDLER_TYPES.IMPORT]: async (params) => keyring.importMnemonic(params),
  [HANDLER_TYPES.GET_LOCKS]: async () => ({
    isUnlocked: keyring?.isUnlocked,
    isInitialized: keyring?.isInitialized,
  }),
  [HANDLER_TYPES.GET_STATE]: async () => keyring.getState(),
  [HANDLER_TYPES.GET_TRANSACTIONS]: async () => {
    const response = await keyring.getTransactions();
    return recursiveParseBigint(response);
  },
  [HANDLER_TYPES.GET_ASSETS]: async (icpPrice) => {
    const e8s = await keyring.getBalance();
    return formatAssets(e8s, icpPrice);
  },
  [HANDLER_TYPES.GET_BALANCE]: async (subaccount) => {
    try {
      const e8s = await keyring.getBalance(subaccount);
      return formatAssets(e8s);
    } catch (error) {
      return { error: error.message };
    }
  },
  [HANDLER_TYPES.SEND_ICP]: async ({ to, amount }) => {
    try {
      const height = await keyring.sendICP(to, BigInt(amount));
      return { height: parseInt(height.toString(), 10) };
    } catch (error) {
      return { error: error.message, height: null };
    }
  },
  [HANDLER_TYPES.EDIT_PRINCIPAL]:
    async ({ walletNumber, name, emoji }) => (
      keyring.editPrincipal(walletNumber, { name, emoji })
    ),
}[type]);
