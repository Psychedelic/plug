import extension from 'extensionizer';
import getICPPrice from '@shared/services/ICPPrice';
import {
  formatAssets,
  parseAssetsAmount,
  parseToBigIntString,
  parseToFloatAmount,
  TOKENS,
} from '@shared/constants/currencies';
import { setRouter } from '@modules/storageManager';

export const NANOS_PER_SECOND = 1_000_000;
export const BALANCE_ERROR = 'You have tried to spend more than the balance of your account';

const parseTransactionObject = (transactionObject) => {
  const {
    amount, currency, token, sonicData,
  } = transactionObject;

  const { decimals } = { ...currency, ...token, ...(sonicData?.token ?? {}) };
  // TODO: Decimals are currently not in DAB. Remove once they are added.
  // eslint-disable-next-line max-len
  const parsedAmount = parseToFloatAmount(amount, decimals || TOKENS[sonicData?.token?.details?.symbol]?.decimals);

  return {
    ...transactionObject,
    amount: parsedAmount,
  };
};

const parseTransaction = (transaction) => {
  const { details } = transaction;
  const { fee } = details;

  const parsedDetails = parseTransactionObject(details);
  let parsedFee = fee;

  if (fee instanceof Object && ('token' in fee || 'currency' in fee)) {
    parsedFee = parseTransactionObject(fee);
  }

  return {
    ...transaction,
    details: {
      ...parsedDetails,
      fee: parsedFee,
    },
  };
};

const parseTransactions = (transactionsObject) => {
  const { transactions = [] } = transactionsObject;

  return {
    ...transactionsObject,
    transactions: transactions.map(parseTransaction),
  };
};

export const recursiveParseBigint = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(recursiveParseBigint);
  }
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = recursiveParseBigint(obj[key]);
      return acc;
    }, {});
  }
  if (typeof obj === 'bigint') {
    return parseInt(obj.toString(), 10);
  }
  return obj;
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
  GET_ICNS_DATA: 'get-icns-data',
  SET_REVERSE_RESOLVED_NAME: 'set-reverse-resolved-name',
  GET_CONTACTS: 'get-contacts',
  ADD_CONTACT: 'add-contact',
  REMOVE_CONTACT: 'remove-contact',
  GET_MNEMONIC: 'get-mnemonic',
  GET_NETWORKS: 'get-networks',
  ADD_NETWORK: 'add-network',
  REMOVE_NETWORK: 'remove-network',
  SET_CURRENT_NETWORK: 'set-current-network',
  GET_CURRENT_NETWORK: 'get-current-network',
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
  [HANDLER_TYPES.GET_ICNS_DATA]: 'getting your ICNS data.',
  [HANDLER_TYPES.SET_REVERSE_RESOLVED_NAME]: 'setting your reverse resolved name.',
  [HANDLER_TYPES.GET_MNEMONIC]: 'getting your mnemonic.',
  [HANDLER_TYPES.GET_NETWORKS]: 'getting the registered networks',
  [HANDLER_TYPES.ADD_NETWORK]: 'adding the network',
  [HANDLER_TYPES.REMOVE_NETWORK]: 'removing the network',
  [HANDLER_TYPES.SET_CURRENT_NETWORK]: 'setting the current network',
  [HANDLER_TYPES.GET_CURRENT_NETWORK]: 'getting the current network',
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
        setRouter('home');
      }
    } catch (e) {
      unlocked = false;
    }
    return unlocked;
  },
  [HANDLER_TYPES.CREATE]: async (params) => {
    try {
      const { mnemonic } = await keyring.create(params);
      return { mnemonic };
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error creating wallet', e);
      return null;
    }
  },
  [HANDLER_TYPES.CREATE_PRINCIPAL]: async (params) => keyring.createPrincipal(params),
  [HANDLER_TYPES.SET_CURRENT_PRINCIPAL]:
    async (walletNumber) => {
      await keyring.setCurrentPrincipal(walletNumber);
      const state = await keyring.getState();
      extension.tabs.query({ active: true }, (tabs) => {
        extension.tabs.sendMessage(tabs[0].id, { action: 'updateConnection' });
      });
      return recursiveParseBigint(state);
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
    const parsed = parseTransactions(response);
    return parsed;
  },
  [HANDLER_TYPES.GET_ASSETS]: async ({ refresh }) => {
    try {
      if (!keyring?.isUnlocked) return {};

      const { wallets, currentWalletId } = await keyring.getState();
      let assets = Object.values(wallets?.[currentWalletId]?.assets);
      const shouldUpdate = Object.values(assets)?.every((asset) => !Number(asset.amount))
        || Object.values(assets)?.some((asset) => asset.amount === 'Error')
        || refresh;
      if (shouldUpdate) {
        assets = await keyring.getBalances();
      } else {
        keyring.getBalances();
      }
      console.log('background script.balance', assets);
      assets = parseAssetsAmount(assets);
      console.log('parsed balances?', assets);
      return (assets || []).map((asset) => recursiveParseBigint(asset));
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error while fetching the assets', e);
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.GET_BALANCE]: async (subaccount) => {
    try {
      const assets = await keyring.getBalances({ subaccount });
      const parsedAssets = parseAssetsAmount(assets);
      const icpPrice = await getICPPrice();
      return formatAssets(parsedAssets, icpPrice);
    } catch (error) {
      // eslint-disable-next-line
      console.log('Error when fetching token balances', error);
      return { error: error.message };
    }
  },
  [HANDLER_TYPES.SEND_TOKEN]: async ({
    to, amount, canisterId, opts, decimals, standard,
  }) => {
    try {
      let tokenInfo;
      if (!decimals) {
        tokenInfo = await keyring.getTokenInfo({ canisterId, standard });
      }
      const _decimals = decimals || tokenInfo?.token?.decimals; // eslint-disable-line
      const parsedAmount = parseToBigIntString(amount, parseInt(_decimals, 10));
      const { height, transactionId } = await keyring.send({
        to, amount: parsedAmount, canisterId, opts,
      });
      return {
        height: height ? parseInt(height, 10) : undefined,
        transactionId: transactionId ? parseInt(transactionId, 10) : undefined,
      };
    } catch (error) {
      // eslint-disable-next-line
      console.log('Error while sending token', error);
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
        const tokenInfo = await keyring.getTokenInfo({
          subaccount: keyring.currentWalletId,
          canisterId,
          standard,
        });
        return { ...tokenInfo, amount: tokenInfo.amount.toString() };
      } catch (e) {
        // eslint-disable-next-line
        console.log('Error while fetching token info', e);
        return { error: e.message };
      }
    },
  [HANDLER_TYPES.ADD_CUSTOM_TOKEN]:
    async ({ canisterId, standard, logo }) => {
      try {
        console.log('Am i getting any logo or scam???', logo);
        // Cambiar esto por un metodo que llame al network module para registrar el token
        const tokens = await keyring.registerToken({
          canisterId, standard, subaccount: keyring.currentWalletId, logo,
        });
        return (tokens || []).map((token) => recursiveParseBigint(token));
      } catch (e) {
        // eslint-disable-next-line
        console.log('Error registering token', e);
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
        // eslint-disable-next-line
        console.log('Error while burning XTC', e);
        return { error: e.message };
      }
    },
  [HANDLER_TYPES.GET_NFTS]: async ({ refresh = false }) => {
    const { wallets, currentWalletId } = await keyring.getState();
    let collections = wallets?.[currentWalletId]?.collections || [];
    if (!collections.length || refresh) {
      collections = await keyring.getNFTs({ subaccount: currentWalletId, refresh });
    }
    return (collections || [])?.map((collection) => recursiveParseBigint(collection));
  },
  [HANDLER_TYPES.TRANSFER_NFT]: async ({ to, nft }) => {
    try {
      const response = await keyring.transferNFT({ to, token: nft });
      return recursiveParseBigint(response);
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error transfering NFT', e);
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.GET_ICNS_DATA]: async ({ refresh }) => {
    const { wallets, currentWalletId } = await keyring.getState();
    let icnsData = wallets?.[currentWalletId]?.icnsData || { names: [] };
    if (!icnsData?.names?.length || refresh) {
      icnsData = await keyring.getICNSData();
    } else {
      keyring.getICNSData();
    }
    return icnsData;
  },
  [HANDLER_TYPES.SET_REVERSE_RESOLVED_NAME]: async (name) => {
    try {
      const res = await keyring.setICNSResolvedName(name);
      return res;
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error setting reverse resolution', e);
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.GET_CONTACTS]: async () => {
    try {
      const res = await keyring.getContacts();
      return res;
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error getting contacts', e);
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.ADD_CONTACT]: async (contact, walletNumber = 0) => {
    try {
      const res = await keyring.addContact(contact, walletNumber);
      return res;
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error adding contact', e);
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.REMOVE_CONTACT]: async (contactName, walletNumber = 0) => {
    try {
      const res = await keyring.deleteContact(contactName, walletNumber);
      return res;
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error removing contact', e);
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.GET_MNEMONIC]: async ({ password }) => {
    try {
      const res = await keyring.getMnemonic(password);
      return res;
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error getting mnemonic', e);
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.GET_NETWORKS]: async () => {
    try {
      const { networks } = keyring.networkModule;
      return Object.values(networks);
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error getting networks', e);
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.ADD_NETWORK]: async (network) => {
    try {
      const networks = await keyring.networkModule.addNetwork(network);
      return Object.values(networks);
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error adding the network', e);
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.REMOVE_NETWORK]: async (networkId) => {
    try {
      const networks = await keyring.networkModule.removeNetwork(networkId);
      return Object.values(networks);
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error removing the network', e);
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.SET_CURRENT_NETWORK]: async (networkId) => {
    try {
      const currentNetwork = await keyring.networkModule.setNetwork(networkId);
      return currentNetwork;
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error setting the current network', e);
      return { error: e.message };
    }
  },
  [HANDLER_TYPES.GET_CURRENT_NETWORK]: async () => {
    try {
      const currentNetwork = keyring.networkModule.network;
      return currentNetwork;
    } catch (e) {
      // eslint-disable-next-line
      console.log('Error getting the current network', e);
      return { error: e.message };
    }
  },
}[type]);