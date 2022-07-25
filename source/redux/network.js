import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getNetworks as callGetNetworks,
  getCurrentNetwork as callGetCurrentNetwork,
  addNetwork as callAddNetwork,
  deleteNetwork as callRemoveNetwork,
  setCurrentNetwork as callSetCurrentNetwork,
} from '@background/Keyring/network';

export const getNetworks = createAsyncThunk(
  'network/getNetworks',
  async () => callGetNetworks(),
);

export const getCurrentNetwork = createAsyncThunk(
  'network/getCurrentNetwork',
  async () => callGetCurrentNetwork(),
);

export const addNetwork = createAsyncThunk(
  'network/addNetwork',
  async (network) => callAddNetwork(network),
);

export const removeNetwork = createAsyncThunk(
  'network/removeNetwork',
  async (networkId) => callRemoveNetwork(networkId),
);

export const setCurrentNetwork = createAsyncThunk(
  'network/setCurrentNetwork',
  async (networkId) => callSetCurrentNetwork(networkId),
);

/* eslint-disable no-param-reassign */
const setLoading = (state) => { state.networksLoading = true; };
const updateNetworks = (state, action) => {
  state.networks = [...action.payload];
  state.networksLoading = false;
};
const updateNetwork = (state, action) => {
  state.currentNetwork = action.payload;
  state.usingMainnet = action.payload.id === 'mainnet';
  state.networksLoading = false;
};

export const networkSlice = createSlice({
  name: 'network',
  initialState: {
    currentNetwork: null,
    networks: [],
    networksLoading: false,
    usingMainnet: true,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNetworks.pending, setLoading)
      .addCase(getNetworks.fulfilled, updateNetworks)
      .addCase(addNetwork.pending, setLoading)
      .addCase(addNetwork.fulfilled, updateNetworks)
      .addCase(removeNetwork.pending, setLoading)
      .addCase(removeNetwork.fulfilled, updateNetworks)
      .addCase(setCurrentNetwork.pending, setLoading)
      .addCase(setCurrentNetwork.fulfilled, updateNetwork)
      .addCase(getCurrentNetwork.pending, setLoading)
      .addCase(getCurrentNetwork.fulfilled, updateNetwork);
  },
});

export default networkSlice.reducer;
