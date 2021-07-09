import ProviderWrapper from '../source/shared/ProviderWrapper';
import { theme } from '../source/ui';
// import { configureStore } from '@reduxjs/toolkit';
// TODO: Mock store
import store from '../source/redux/store';

// const store = configureStore({
//   reducer: {
//     wallet: {},
//     icp: {},
//   }
// });

export const withProvider = (story) => (
  <ProviderWrapper
    store={store}
    theme={theme}
  >
    { story() }
  </ProviderWrapper>
);
