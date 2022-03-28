import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './wallet';
import icpReducer from './icp';
import nftReducer from './nfts';
import profileReducer from './profile';
import clockReducer from './clock';

const reducer = {
  wallet: walletReducer,
  icp: icpReducer,
  nfts: nftReducer,
  profile: profileReducer,
  clock: clockReducer,
};

const store = configureStore({
  reducer,
});

export default store;
