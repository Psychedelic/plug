import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { ACTIVITY_STATUS } from '@shared/constants/activity';
import { CURRENCIES } from '@shared/constants/currencies';
import extension from 'extensionizer';

export const getTransactions = createAsyncThunk(
  'wallet/getTransactions',
  async () => extension.runtime.sendMessage({ type: 'get-keyring-transactions', params: {} }, (transactions) => {
    const mapTransaction = (trx) => {
      const type = Object.keys(trx.transfer)[0];
      const amount = trx.tranfer[type]?.amount?.e8s; // The same regardless of the type
      return {
        type,
        currency: CURRENCIES.get('ICP'),
        amount,
        date: new Date(trx?.timestamp),
        value: amount * 40 /* TODO: Add helder's fee function / call to nns */,
        status: ACTIVITY_STATUS.DONE,
        plug: null,
      };
    };

    return transactions?.map?.(mapTransaction) || [];
  }),
);

/* eslint-disable no-param-reassign */
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    name: 'Main IC Wallet',
    principalId: '',
    accountId: '',
    emoji: '🔌',
    transactions: [],
  },
  reducers: {
    updateWalletDetails: (state, action) => {
      const { name, emoji } = action.payload;
      state.name = name;
      state.emoji = emoji;
    },
    setAccountInfo: (state, action) => {
      // Chrome serializes everything with toJSON
      const {
        accountId, icon, name, identity,
      } = action.payload;
      const id = Ed25519KeyIdentity.fromParsedJson(identity);
      const principalId = id.getPrincipal().toString();
      state.accountId = accountId;
      state.icon = icon;
      state.name = name;
      state.principalId = principalId;
    },
    setTransactions: (state, action) => {
      const mapTransaction = (trx) => {
        const type = Object.keys(trx.transfer)[0];
        const amount = trx.tranfer[type]?.amount?.e8s; // The same regardless of the type
        return {
          type,
          currency: CURRENCIES.get('ICP'),
          amount,
          date: new Date(trx?.timestamp),
          value: amount * 40 /* TODO: Add helder's fee function / call to nns */,
          status: ACTIVITY_STATUS.DONE,
          plug: null,
        };
      };
      state.transactions = action.payload?.map?.(mapTransaction) || [];
    },
  },
});

export const { updateWalletDetails, setAccountInfo, setTransactions } = walletSlice.actions;

export default walletSlice.reducer;
