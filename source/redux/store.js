import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './wallet';
import icpReducer from './icp';
import nftReducer from './nfts';
import profileReducer from './profile';
import clockReducer from './clock';
import icnsReducer from './icns';
import contactsReducer from './contacts';

const reducer = {
  wallet: walletReducer,
  icp: icpReducer,
  nfts: nftReducer,
  profile: profileReducer,
  clock: clockReducer,
  icns: icnsReducer,
  contacts: contactsReducer,
};

const store = configureStore({
  reducer,
});

export default store;
