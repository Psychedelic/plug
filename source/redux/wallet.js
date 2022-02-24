import { createSlice } from '@reduxjs/toolkit';
import { ACTIVITY_STATUS } from '@shared/constants/activity';
import {
  formatAssetBySymbol,
  formatAssets,
  TOKENS,
  TOKEN_IMAGES,
} from '@shared/constants/currencies';

const sortCollections = (a, b) => b?.tokens.length - a?.tokens.length;

/* eslint-disable no-param-reassign */
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    name: 'Account 1',
    principalId: '',
    accountId: '',
    emoji: '👽',
    transactions: [],
    assets: Object.values(TOKENS),
    walletNumber: 0,
    assetsLoading: true,
    collections: [],
    collectionsLoading: true,
    transactionsLoading: true,
  },
  reducers: {
    updateWalletDetails: (state, action) => {
      const { name, emoji } = action.payload;
      state.name = name;
      state.emoji = emoji;
    },
    setAccountInfo: (state, action) => {
      if (!action.payload) return;
      // Chrome serializes everything with toJSON
      const {
        accountId, icon, name, principal, walletNumber,
      } = action.payload;
      state.accountId = accountId;
      state.emoji = icon;
      state.name = name;
      state.principalId = principal;
      state.walletNumber = walletNumber;
    },
    setTransactions: (state, action) => {
      const mapTransaction = (trx) => {
        const getSymbol = () => {
          if ('tokenRegistryInfo' in (trx?.details?.canisterInfo || [])) return trx?.details?.canisterInfo.tokenRegistryInfo.symbol;
          if ('nftRegistryInfo' in (trx?.details?.canisterInfo || [])) return 'NFT';
          return trx?.details?.currency?.symbol ?? trx?.details?.sonicData?.token?.details?.symbol ?? '';
        };
        console.log('isSonic?', trx?.details);
        const asset = formatAssetBySymbol(
          trx?.details?.amount,
          getSymbol(),
          action?.payload?.icpPrice,
        );
        const isOwnTx = [state.principalId, state.accountId].includes(trx?.caller);
        const getType = () => {
          const { type } = trx;
          if (type.toUpperCase() === 'TRANSFER') {
            return isOwnTx ? 'SEND' : 'RECEIVE';
          }
          return type.toUpperCase();
        };
        const transaction = {
          ...asset,
          type: getType(),
          hash: trx?.hash,
          to: trx?.details?.to,
          from: trx?.details?.from || trx?.caller,
          date: new Date(trx?.timestamp),
          status: ACTIVITY_STATUS[trx?.details?.status],
          image: trx?.details?.canisterInfo?.icon || TOKEN_IMAGES[getSymbol()] || '',
          symbol: getSymbol(),
          canisterId: trx?.details?.canisterInfo?.canisterId,
          plug: null,
          canisterInfo: trx?.canisterInfo,
          details: { ...trx?.details, caller: trx?.caller },
        };
        return transaction;
      };
      const parsedTrx = action.payload?.transactions?.map(mapTransaction) || [];
      state.transactions = parsedTrx.slice(0, 50); // TODO: Move paging to BE
    },
    setTransactionsLoading: (state, action) => {
      state.transactionsLoading = action.payload;
    },
    setAssets: (state, action) => {
      const { keyringAssets, icpPrice } = action.payload || {};

      const formattedAssets = formatAssets(keyringAssets, icpPrice);

      state.assets = [...formattedAssets];
    },
    setAssetsLoading: (state, action) => {
      state.assetsLoading = action.payload;
    },
    addCollection: (state, action) => {
      const { collection, walletNumber } = action.payload;
      if (state.walletNumber === walletNumber && collection) {
        const collectionIndex = state.collections.findIndex(
          (col) => col.canisterId === collection.canisterId,
        );
        state?.collections.splice(
          collectionIndex, collectionIndex < 0 ? 0 : 1, collection,
        );
        state.collections = state?.collections?.sort(sortCollections);
      }
    },
    setCollections: (state, action) => {
      const { collections, principalId } = action.payload;
      if (state.principalId === principalId && collections) {
        state.collections = collections?.sort(sortCollections);
      }
      state.optimisticNFTUpdate = false;
    },
    setCollectionsLoading: (state, action) => {
      state.collectionsLoading = action.payload;
    },
    removeNFT: (state, action) => {
      const collections = state.collections.map((col) => ({
        ...col,
        tokens: col.tokens.filter((token) => token.id !== action.payload?.id),
      }));
      state.collections = collections.filter((col) => col.tokens.length);
      state.optimisticNFTUpdate = true;
    },
  },
});

export const {
  updateWalletDetails,
  setAccountInfo,
  setTransactions,
  setTransactionsLoading,
  setAssets,
  setAssetsLoading,
  addCollection,
  setCollections,
  setCollectionsLoading,
  removeNFT,
} = walletSlice.actions;

export default walletSlice.reducer;
