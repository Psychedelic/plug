import { createSlice } from '@reduxjs/toolkit';
import { ACTIVITY_STATUS, ACTIVITY_TYPES } from '@shared/constants/activity';
import { CURRENCIES } from '@shared/constants/currencies';
import { E8S_PER_ICP, NANOS_PER_SECOND } from '@background/Keyring';

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
        accountId, icon, name, principal,
      } = action.payload;
      state.accountId = accountId;
      state.emoji = icon;
      state.name = name;
      state.principalId = principal;
    },
    setTransactions: (state, action) => {
      const mapTransaction = (trx) => {
        const amount = parseInt(trx?.amount?.toString(), 10) / E8S_PER_ICP;
        const transaction = {
          type: ACTIVITY_TYPES[trx?.type],
          currency: CURRENCIES.get(trx?.currency?.symbol),
          amount,
          date: new Date(trx?.timestamp / NANOS_PER_SECOND),
          value: amount * action?.payload?.icpPrice,
          status: ACTIVITY_STATUS[trx?.status],
          to: trx?.to,
          plug: null,
          from: trx?.from,
          hash: trx?.hash,
        };
        return transaction;
      };
      const parsedTrx = action.payload?.transactions?.map(mapTransaction) || [];
      state.transactions = parsedTrx.slice(0, 50); // TODO: Move paging to BE
    },
    setAssets: (state, action) => {
      state.assets = action.payload;
    },
  },
});

export const {
  updateWalletDetails,
  setAccountInfo,
  setTransactions,
  setAssets,
} = walletSlice.actions;

export default walletSlice.reducer;
