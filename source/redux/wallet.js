import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ACTIVITY_STATUS } from '@shared/constants/activity';
import { CURRENCIES } from '@shared/constants/currencies';
import { KeyRing } from '@background';

export const getTransactions = createAsyncThunk('wallet/getTransactions', async () => {
  const transactions = await KeyRing.getTransactions();
  const mapTransaction = (trx) => {
    const type = Object.keys(trx.transfer)[0];
    const amount = trx.tranfer[type]?.amount?.e8s; // The same regardless of the type
    return {
      type,
      currency: CURRENCIES.get('ICP'),
      amount,
      date: new Date(trx?.timestamp),
      value: amount * 40, /* TODO: Add helder's fee function / call to nns */
      status: ACTIVITY_STATUS.DONE,
      plug: null,
    };
  };

  return transactions?.map?.(mapTransaction) || [];
});

/* eslint-disable no-param-reassign */
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    name: 'Main IC Wallet',
    address: 'rwlgt-iiaaa-aaaaa-aaaaa-cai',
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
  },
});

export const { updateWalletDetails } = walletSlice.actions;

export default walletSlice.reducer;
