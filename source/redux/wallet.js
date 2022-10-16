import { createSlice } from '@reduxjs/toolkit';
import { ACCOUNT_ICON } from '@shared/constants/account';
import {
  formatAssetBySymbol,
  formatAssets,
  TOKENS,
} from '@shared/constants/currencies';

const sortCollections = (collections = []) => {
  const icns = collections.find((col) => col.name === 'ICNS');
  const sorted = collections
    .filter((col) => col.name !== 'ICNS')
    .sort((a, b) => b?.name - a?.name);
  return [icns, ...sorted].filter((col) => !!col);
};

/* eslint-disable no-param-reassign */
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    name: 'Account 1',
    principalId: '',
    accountId: '',
    emoji: ACCOUNT_ICON,
    assets: Object.values(TOKENS),
    walletId: '',
    assetsLoading: true,
    collections: [],
    collectionsLoading: false,
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
        accountId, icon, name, principal, walletId,
      } = action.payload;
      state.accountId = accountId;
      state.emoji = icon;
      state.name = name;
      state.principalId = principal;
      state.walletId = walletId;
    },
    setAssets: (state, action) => {
      const { keyringAssets, icpPrice } = action.payload || {};

      const formattedAssets = formatAssets(keyringAssets, icpPrice);

      state.assets = [...formattedAssets];
    },
    setAssetsLoading: (state, action) => {
      state.assetsLoading = action.payload;
    },
    setCollections: (state, action) => {
      const { collections, principalId } = action.payload;
      if (state.principalId === principalId && collections) {
        state.collections = sortCollections(collections);
      }
      state.optimisticNFTUpdate = false;
    },
    setCollectionsLoading: (state, action) => {
      state.collectionsLoading = action.payload;
    },
    blockNFTFetch: (state) => {
      state.optimisticNFTUpdate = true;
    },
  },
});

export const {
  updateWalletDetails,
  setAccountInfo,
  setAssets,
  setAssetsLoading,
  setCollections,
  setCollectionsLoading,
  blockNFTFetch,
} = walletSlice.actions;

export default walletSlice.reducer;
