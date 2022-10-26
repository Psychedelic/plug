import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { asyncSendMessage, HANDLER_TYPES } from '@background/Keyring';

export const getNFTs = createAsyncThunk(
  'nfts/getNFTs',
  async ({ refresh } = { refresh: false }) => asyncSendMessage({
    type: HANDLER_TYPES.GET_NFTS,
    params: { refresh },
  }),
);

export const transferNFT = createAsyncThunk(
  'nfts/transferNFT',
  async (params) => asyncSendMessage({
    type: HANDLER_TYPES.TRANSFER_NFT,
    params,
  }),
);

export const registerNFT = createAsyncThunk(
  'nfts/registerNFT',
  async (params) => asyncSendMessage({
    type: HANDLER_TYPES.ADD_CUSTOM_NFT,
    params,
  }),
);

const sortCollections = (collections = []) => {
  const icns = collections.find((col) => col.name === 'ICNS');
  const sorted = collections
    .filter((col) => col.name !== 'ICNS')
    .sort((a, b) => b?.name - a?.name);
  return [icns, ...sorted].filter((col) => !!col);
};

const setCollectionsLoading = (state) => { state.collectionsLoading = true; };
const updateCollections = (state, action) => {
  state.collections = sortCollections(action.payload);
  state.collectionsLoading = false;
};
const setError = (state, action) => { state.error = action.payload; };

/* eslint-disable no-param-reassign */
export const nftSlice = createSlice({
  name: 'nfts',
  initialState: {
    selectedNft: null,
    sendAddress: null,
    resolvedSendAddress: null,
    collections: [],
    collectionsLoading: false,
    error: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(getNFTs.pending, setCollectionsLoading)
      .addCase(getNFTs.rejected, setError)
      .addCase(getNFTs.fulfilled, updateCollections)
      .addCase(transferNFT.pending, setCollectionsLoading)
      .addCase(transferNFT.fulfilled, (state, action) => {
        updateCollections(state, action);
        state.selectedNft = null;
      })
      .addCase(transferNFT.rejected, setError)
      .addCase(registerNFT.pending, setCollectionsLoading)
      .addCase(registerNFT.fulfilled, updateCollections)
      .addCase(registerNFT.rejected, setError);
  },
});

export const { setSelectedNft, setSendAddress } = nftSlice.actions;

export default nftSlice.reducer;
