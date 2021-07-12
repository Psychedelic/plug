import ProviderWrapper from '../source/shared/ProviderWrapper';
import { theme } from '../source/ui';
// import { configureStore } from '@reduxjs/toolkit';
// TODO: Mock store
import store from '../source/redux/store';

import {
  Route,
  Router,
  StorageMock,
} from '../source/components';

export const withProvider = (story) => (
  <ProviderWrapper
    store={store}
    theme={theme}
  >
    { story() }
  </ProviderWrapper>
);

const storageMock = new StorageMock();

export const RouterWrapper = ({ story }) => (
  <Router
    initialRouteName="home"
    storage={storageMock}
  >
    <Route
      name="home"
      component={story}
    />
  </Router>
);
