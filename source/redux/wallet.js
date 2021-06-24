import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    name: 'Main IC Wallet',
    address: 'rwlgt-iiaaa-aaaaa-aaaaa-cai',
    emoji: '🔌',
  },
  reducers: {
    updateWalletDetails: (state, action) => {
      const { name, emoji } = action.payload;
      state.name = name;
      state.emoji = emoji;
    },
  },
});

export const { updateWalletDetails } = walletSlice.actions;

export default walletSlice.reducer;
