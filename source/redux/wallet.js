import { createSlice } from '@reduxjs/toolkit';
import { ACTIVITY_STATUS, ACTIVITY_TYPES } from '@shared/constants/activity';
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
        const asset = formatAssetBySymbol(
          trx?.amount,
          trx?.currency?.symbol,
          action?.payload?.icpPrice,
        );
        const transaction = {
          ...asset,
          type: ACTIVITY_TYPES[trx?.type],
          date: new Date(trx?.timestamp),
          status: ACTIVITY_STATUS[trx?.status],
          to: trx?.to,
          plug: null,
          from: trx?.from,
          hash: trx?.hash,
          image: TOKEN_IMAGES[trx?.currency?.symbol] || '',
          symbol: trx?.currency?.symbol,
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

      state.assets = formattedAssets;
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
      const { collections, walletNumber } = action.payload;
      if (state.walletNumber === walletNumber && collections) {
        state.collections = collections?.sort(sortCollections);
      }
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
