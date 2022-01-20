import extension from 'extensionizer';
import getICPPrice from '@shared/services/ICPPrice';
import { formatAssets } from '@shared/constants/currencies';

export const NANOS_PER_SECOND = 1_000_000;
export const BALANCE_ERROR = 'You have tried to spend more than the balance of your account';

export const recursiveParseBigint = (obj) => Object.entries(obj).reduce(
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
  GET_LOCKS: 'get-locks',
  SEND_TOKEN: 'send-token',
  EDIT_PRINCIPAL: 'edit-principal',
  GET_PUBLIC_KEY: 'get-public-key',
  GET_TOKEN_INFO: 'get-token-info',
  ADD_CUSTOM_TOKEN: 'add-custom-token',
  CREATE_PRINCIPAL: 'create-principal',
  SET_CURRENT_PRINCIPAL: 'set-current-principal',
  GET_PEM_FILE: 'get-pem-file',
  BURN_XTC: 'burn-xtc',
  GET_NFTS: 'get-nfts',
  TRANSFER_NFT: 'transfer-nft',
};

export const getKeyringErrorMessage = (type) => ({
  [HANDLER_TYPES.LOCK]: 'locking your Keyring.',
  [HANDLER_TYPES.UNLOCK]: 'unlocking your Keyring.',
  [HANDLER_TYPES.CREATE]: 'creating your Keyring',
  [HANDLER_TYPES.IMPORT]: 'importing import your Keyring.',
  [HANDLER_TYPES.GET]: 'getting your Keyring.',
  [HANDLER_TYPES.GET_STATE]: 'getting your Keyring state.',
  [HANDLER_TYPES.GET_TRANSACTIONS]: 'reading your transactions.',
  [HANDLER_TYPES.GET_ASSETS]: 'reading your assets.',
  [HANDLER_TYPES.GET_BALANCE]: 'reading your balance.',
  [HANDLER_TYPES.SEND_TOKEN]: 'sending token.',
  [HANDLER_TYPES.EDIT_PRINCIPAL]: 'editing your principal.',
  [HANDLER_TYPES.GET_PUBLIC_KEY]: 'getting your public key.',
  [HANDLER_TYPES.GET_TOKEN_INFO]: 'fetching token info.',
  [HANDLER_TYPES.ADD_CUSTOM_TOKEN]: 'adding custom token.',
  [HANDLER_TYPES.CREATE_PRINCIPAL]: 'creating your principal.',
  [HANDLER_TYPES.SET_CURRENT_PRINCIPAL]: 'setting your principal.',
  [HANDLER_TYPES.GET_PEM_FILE]: 'getting your PEM file.',
  [HANDLER_TYPES.BURN_XTC]: 'burning XTC.',
  [HANDLER_TYPES.GET_NFTS]: 'getting your NTF\'s.',
  [HANDLER_TYPES.TRANSFER_NFT]: 'transfering your NFT.',
}[type]);

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
  [HANDLER_TYPES.CREATE_PRINCIPAL]: async (params) => keyring.createPrincipal(params),
  [HANDLER_TYPES.SET_CURRENT_PRINCIPAL]:
    async (walletNumber) => {
      await keyring.setCurrentPrincipal(walletNumber);

      return keyring.getState();
    },
  [HANDLER_TYPES.IMPORT]: async (params) => keyring.importMnemonic(params),
  [HANDLER_TYPES.GET_LOCKS]: async () => ({
    isUnlocked: keyring?.isUnlocked,
    isInitialized: keyring?.isInitialized,
  }),
  [HANDLER_TYPES.GET_STATE]: async () => {
    const response = await keyring.getState();
    return recursiveParseBigint(response);
  },
  [HANDLER_TYPES.GET_TRANSACTIONS]: async () => {
    const response = await keyring.getTransactions();
    return recursiveParseBigint(response);
  },
  [HANDLER_TYPES.GET_ASSETS]: async ({ refresh }) => {
    try {
      if (!keyring?.isUnlocked) return {};

      const { wallets, currentWalletId } = await keyring.getState();
      let assets = wallets?.[currentWalletId]?.assets;

      const shouldUpdate = assets?.every((asset) => !Number(asset.amount))
        || assets?.some((asset) => asset.amount === 'Error')
        || refresh;

      if (shouldUpdate) {
        assets = await keyring.getBalances();
      } else {
        keyring.getBalances();
      }
      return assets;
    } catch (e) {
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.GET_BALANCE]: async (subaccount) => {
    try {
      const balances = await keyring.getBalances(subaccount);
      const icpPrice = await getICPPrice();
      return formatAssets(balances, icpPrice);
    } catch (error) {
      return { error: error.message };
    }
  },
  [HANDLER_TYPES.SEND_TOKEN]: async ({
    to, amount, canisterId, opts,
  }) => {
    try {
      const { height, transactionId } = await keyring.send(to, amount, canisterId, opts);
      return {
        height: height ? parseInt(height, 10) : undefined,
        transactionId: transactionId ? parseInt(transactionId, 10) : undefined,
      };
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
    async ({ canisterId, standard }) => {
      try {
        const tokenInfo = await keyring.getTokenInfo(canisterId, standard);
        return { ...tokenInfo, amount: tokenInfo.amount.toString() };
      } catch (e) {
        return { error: e.message };
      }
    },
  [HANDLER_TYPES.ADD_CUSTOM_TOKEN]:
    async ({ canisterId, standard }) => {
      try {
        const response = await keyring.registerToken(canisterId, standard);
        return response;
      } catch (e) {
        return { error: e.message };
      }
    },
  [HANDLER_TYPES.GET_PEM_FILE]:
    async (walletNumber) => keyring.getPemFile(walletNumber),
  [HANDLER_TYPES.BURN_XTC]:
    async ({ to, amount }) => {
      try {
        const response = await keyring.burnXTC({ to, amount });
        return recursiveParseBigint(response);
      } catch (e) {
        return { error: e.message };
      }
    },
  [HANDLER_TYPES.GET_NFTS]: async ({ refresh = false }) => {
    const { wallets, currentWalletId } = await keyring.getState();
    let collections = wallets?.[currentWalletId]?.collections || [];
    if (!collections.length) {
      collections = await keyring.getNFTs(currentWalletId, refresh);
    }
    return (collections || [])?.map((collection) => recursiveParseBigint(collection));
  },
  [HANDLER_TYPES.TRANSFER_NFT]:
    async ({ to, nft }) => {
      try {
        const response = await keyring.transferNFT({ to, token: nft });
        return recursiveParseBigint(response);
      } catch (e) {
        return { error: e.message };
      }
    },
}[type]);
