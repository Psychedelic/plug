import { createSlice } from '@reduxjs/toolkit';
import { ACCOUNT_ICON } from '@shared/constants/account';
import {
  formatAssets,
  TOKENS,
} from '@shared/constants/currencies';

/* eslint-disable no-param-reassign */
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    name: 'Account 1',
    principalId: '',
    accountId: '',
    emoji: ACCOUNT_ICON,
    transactions: [],
    assets: Object.values(TOKENS),
    walletId: '',
    assetsLoading: true,
    transactionsLoading: false,
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
    setTransactions: (state, action) => {
      const transactions = action.payload || {};
      state.transactions = transactions;
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
    blockNFTFetch: (state) => {
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
  blockNFTFetch,
} = walletSlice.actions;

export default walletSlice.reducer;
