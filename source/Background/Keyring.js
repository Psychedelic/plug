import { CURRENCIES } from '@shared/constants/currencies';

export const E8S_PER_ICP = 100_000_000;

export const HANDLER_TYPES = {
  LOCK: 'lock-keyring',
  UNLOCK: 'unlock-keyring',
  CREATE: 'create-keyring',
  IMPORT: 'import-keyring',
  GET: 'get-keyring',
  GET_STATE: 'get-keyring-state',
  GET_TRANSACTIONS: 'get-keyring-transactions',
  GET_ASSETS: 'get-keyring-assets',
};

export const getKeyringHandler = (type, keyring) => ({
  [HANDLER_TYPES.LOCK]: async () => keyring.lock(),
  [HANDLER_TYPES.UNLOCK]: async (params) => {
    let unlocked = false;
    try {
      unlocked = await keyring.unlock(params?.password);
    } catch (e) {
      unlocked = false;
    }
    return unlocked;
  },
  [HANDLER_TYPES.CREATE]: async (params) => keyring.create({ ...params }),
  [HANDLER_TYPES.IMPORT]: async (params) => keyring.importMnemonic({ ...params }),
  [HANDLER_TYPES.GET_LOCKS]: () => ({
    isUnlocked: keyring?.isUnlocked,
    isInitialized: keyring?.isInitialized,
  }),
  [HANDLER_TYPES.GET_STATE]: async () => keyring.getState(),
  [HANDLER_TYPES.GET_TRANSACTIONS]: async () => keyring.transactions,
  [HANDLER_TYPES.GET_ASSETS]: async () => {
    const e8s = await keyring.getBalance();
    // The result is in e8s and a bigint. We parse it and transform to ICP
    const balance = parseInt(e8s.toString(), 10) / E8S_PER_ICP;
    const assets = [{
      image: CURRENCIES.get('ICP').image,
      name: CURRENCIES.get('ICP').name,
      amount: balance,
      value: balance,
      currency: CURRENCIES.get('ICP').value,
    }];
    return assets;
  },
})[type];
