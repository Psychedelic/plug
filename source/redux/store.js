import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './wallet';

const reducer = {
  wallet: walletReducer,
};

const store = configureStore({
  reducer,
});

// store.subscribe(() => {
//  saveState(store.getState().wallet);
// });

export default store;
