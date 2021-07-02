import { CURRENCIES } from '@shared/constants/currencies';

export const E8S_PER_ICP = 100_000_000;
export const NANOS_PER_SECOND = 1_000_000;

const recursiveParseBigint = (obj) => Object.entries(obj).reduce((acum, [key, val]) => {
  if (val instanceof Object) {
    const res = Array.isArray(val)
      ? val.map((el) => recursiveParseBigint(el))
      : recursiveParseBigint(val);
    return { ...acum, [key]: res };
  } if (typeof (val) === 'bigint') {
    return { ...acum, [key]: parseInt(val.toString(), 10) };
  }
  return { ...acum, [key]: val };
}, { ...obj });

const formatAssets = (e8s) => {
  // The result is in e8s and a bigint. We parse it and transform to ICP
  const icpBalance = parseInt(e8s.toString(), 10) / E8S_PER_ICP;
  const assets = [{
    image: CURRENCIES.get('ICP').image,
    name: CURRENCIES.get('ICP').name,
    amount: icpBalance,
    value: icpBalance,
    currency: CURRENCIES.get('ICP').value,
  }];
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
  SEND_ICP: 'send-icp',
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
  [HANDLER_TYPES.CREATE]: async (params) => keyring.create(params),
  [HANDLER_TYPES.IMPORT]: async (params) => keyring.importMnemonic(params),
  [HANDLER_TYPES.GET_LOCKS]: () => ({
    isUnlocked: keyring?.isUnlocked,
    isInitialized: keyring?.isInitialized,
  }),
  [HANDLER_TYPES.GET_STATE]: async () => keyring.getState(),
  [HANDLER_TYPES.GET_TRANSACTIONS]: async () => {
    const response = await keyring.getTransactions();
    return recursiveParseBigint(response);
  },
  [HANDLER_TYPES.GET_ASSETS]: async () => {
    const e8s = await keyring.getBalance();
    return formatAssets(e8s);
  },
  [HANDLER_TYPES.SEND_ICP]: async ({ to, amount }) => {
    console.log('calling send', to, amount);
    await keyring.sendICP(to, BigInt(amount));
    console.log('sent called, calling balance');
    const e8s = await keyring.getBalance();
    console.log('balance', parseInt(e8s.toString(), 10));
    return formatAssets(e8s);
  },
})[type];
