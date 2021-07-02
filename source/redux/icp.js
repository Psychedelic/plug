import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    icpPrice: null,
  },
  reducers: {
    setIcpPrice: (state, action) => {
      state.icpPrice = action.payload;
    },
  },
});

export const { setIcpPrice } = walletSlice.actions;

export default walletSlice.reducer;
