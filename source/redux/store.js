import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './wallet';
import icpReducer from './icp';

const reducer = {
  wallet: walletReducer,
  icp: icpReducer,
};

const store = configureStore({
  reducer,
});

export default store;
