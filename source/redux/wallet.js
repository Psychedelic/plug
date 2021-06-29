import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ACTIVITY_STATUS } from '@shared/constants/activity';
import { CURRENCIES } from '@shared/constants/currencies';
import { KeyRing } from '@background';

export const getTransactions = createAsyncThunk(
  'wallet/getTransactions',
  async () => {
    const transactions = await KeyRing.getTransactions();
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
  },
);

export const getData = createAsyncThunk('wallet/getData', async () => {
  const { wallets } = await KeyRing.getState();
  return wallets[0];
});

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
  },
  extraReducers: {
    [getTransactions.fulfilled]: (state, action) => {
      state.transactions = action.payload;
    },
    [getTransactions.rejected]: (state, action) => {
      /* eslint-disable-next-line no-console */
      console.log(action.error.message);
      state.transactions = [];
    },
    [getData.fulfilled]: (state, action) => {
      const { accountId, icon, name } = action.payload;
      const principalId = action.payload.principal.toString();

      state.accountId = accountId;
      state.icon = icon;
      state.name = name;
      state.principalId = principalId;
    },
  },
});

export const { updateWalletDetails } = walletSlice.actions;

export default walletSlice.reducer;
