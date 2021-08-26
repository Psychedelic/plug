import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const nftSlice = createSlice({
  name: 'nfts',
  initialState: {
    nfts: [],
    selectedNft: null,
    nftsLoading: true,
  },
  reducers: {
    setSelectedNft: (state, action) => {
      state.selectedNft = action.payload;
    },
    setNfts: (state, action) => {
      state.nfts = action.payload;
    },
    setNftsLoading: (state, action) => {
      state.nftsLoading = action.payload;
    },
  },
});

export const { setNfts, setSelectedNft, setNftsLoading } = nftSlice.actions;

export default nftSlice.reducer;
