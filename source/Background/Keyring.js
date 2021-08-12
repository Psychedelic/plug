import { E8S_PER_ICP, TOKEN_IMAGES, USD_PER_TC } from '@shared/constants/currencies';
import extension from 'extensionizer';

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

const formatAssetBySymbol = (_amount, symbol, icpPrice) => {
  const amount = parseInt(_amount.toString(), 10);
  return ({
    ICP: {
      amount: amount / E8S_PER_ICP,
      value: (amount * icpPrice) / E8S_PER_ICP,
      image: TOKEN_IMAGES.ICP,
    },
    XTC: {
      amount: amount / 1_000_000_000_000,
      value: (amount * USD_PER_TC) / 1_000_000_000_000,
      image: TOKEN_IMAGES.XTC,
    },
    default: { amount, value: amount },
  })[symbol || 'default'] || { amount, value: amount, image: TOKEN_IMAGES.ICP };
};

const formatAssets = (balances, icpPrice) => {
  const mappedAssets = balances.map(({ amount, name, symbol }) => {
    const asset = formatAssetBySymbol(amount, symbol, icpPrice);
    return {
      ...asset,
      name,
      symbol,
    };
  });
  return mappedAssets;
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
  SEND_TOKEN: 'send-token',
  EDIT_PRINCIPAL: 'edit-principal',
  GET_PUBLIC_KEY: 'get-public-key',
  GET_TOKEN_INFO: 'get-token-info',
  ADD_CUSTOM_TOKEN: 'add-custom-token',
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
    const balances = await keyring.getBalance();
    return formatAssets(balances, icpPrice);
  },
  [HANDLER_TYPES.GET_BALANCE]: async (subaccount) => {
    try {
      const balances = await keyring.getBalance(subaccount);
      return formatAssets(balances);
    } catch (error) {
      return { error: error.message };
    }
  },
  [HANDLER_TYPES.SEND_TOKEN]: async ({ to, amount }) => {
    try {
      const height = await keyring.send(to, BigInt(amount));
      return { height: parseInt(height.toString(), 10) };
    } catch (error) {
      return { error: error.message, height: null };
    }
  },
  [HANDLER_TYPES.EDIT_PRINCIPAL]:
    async ({ walletNumber, name, emoji }) => (
      keyring.editPrincipal(walletNumber, { name, emoji })
    ),
  [HANDLER_TYPES.GET_PUBLIC_KEY]:
      async () => keyring.getPublicKey(),
  [HANDLER_TYPES.GET_TOKEN_INFO]:
      async (canisterId) => {
        try {
          const tokenInfo = await keyring.getTokenInfo(canisterId);
          return { ...tokenInfo, amount: parseInt(tokenInfo.amount.toString(), 10) };
        } catch (e) {
          return { error: e.message };
        }
      },
  [HANDLER_TYPES.ADD_CUSTOM_TOKEN]:
      async (canisterId) => {
        try {
          const response = await keyring.registerToken(canisterId);
          return response;
        } catch (e) {
          return { error: e.message };
        }
      },
}[type]);
