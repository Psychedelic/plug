import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const nftSlice = createSlice({
  name: 'nfts',
  initialState: {
    selectedNft: null,
  },
  reducers: {
    setSelectedNft: (state, action) => {
      state.selectedNft = action.payload;
    },
  },
});

export const { setSelectedNft } = nftSlice.actions;

export default nftSlice.reducer;
