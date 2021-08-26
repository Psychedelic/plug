import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './wallet';
import icpReducer from './icp';
import nftReducer from './nfts';

const reducer = {
  wallet: walletReducer,
  icp: icpReducer,
  nfts: nftReducer,
};

const store = configureStore({
  reducer,
});

export default store;
