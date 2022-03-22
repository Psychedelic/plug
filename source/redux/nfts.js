import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const nftSlice = createSlice({
  name: 'nfts',
  initialState: {
    selectedNft: null,
    sendAddress: null,
    resolvedSendAddress: null,
  },
  reducers: {
    setSelectedNft: (state, action) => {
      state.selectedNft = action.payload;
    },
    setSendAddress: (state, action) => {
      const { address, resolvedAddress } = action.payload || {};
      state.sendAddress = address;
      state.resolvedSendAddress = resolvedAddress;
    },
  },
});

export const { setSelectedNft, setSendAddress } = nftSlice.actions;

export default nftSlice.reducer;
