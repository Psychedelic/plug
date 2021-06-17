import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './wallet';

const reducer = {
  wallet: walletReducer,
};

const store = configureStore({
  reducer,
});

export default store;
