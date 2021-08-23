import { createSlice } from '@reduxjs/toolkit';
import { ACTIVITY_STATUS, ACTIVITY_TYPES } from '@shared/constants/activity';
import { E8S_PER_ICP, formatAssetBySymbol, TOKEN_IMAGES } from '@shared/constants/currencies';

/* eslint-disable no-param-reassign */
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    name: 'Main IC Wallet',
    principalId: '',
    accountId: '',
    emoji: '👽',
    transactions: [],
    assets: [],
    walletNumber: 0,
    assetsLoading: true,
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
          trx?.amount, trx?.currency?.symbol, action?.payload?.icpPrice
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
    setAssets: (state, action) => {
      state.assets = action.payload;
    },
    setAssetsLoading: (state, action) => {
      state.assetsLoading = action.payload;
    },
  },
});

export const {
  updateWalletDetails,
  setAccountInfo,
  setTransactions,
  setAssets,
  setAssetsLoading,
} = walletSlice.actions;

export default walletSlice.reducer;
