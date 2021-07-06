import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    icpPrice: null,
  },
  reducers: {
    setICPPrice: (state, action) => {
      state.icpPrice = action.payload;
    },
  },
});

export const { setICPPrice } = walletSlice.actions;

export default walletSlice.reducer;
