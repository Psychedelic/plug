import React from 'react';
import PropTypes from 'prop-types';
import extension from 'extensionizer';
import {
  Route,
  Router,
  storagePropType,
  StorageProvider,
} from '@components';
import Home from './Views/Home';
import Help from './Views/Help';
import Settings from './Views/Settings';
import WalletDetails from './Views/WalletDetails';
import SeedPhrase from './Views/SeedPhrase';
import Deposit from './Views/Deposit';
import Swap from './Views/Swap';
import Send from './Views/Send';
import Contacts from './Views/Contacts';

const Popup = ({ storage }) => (
  <StorageProvider storage={storage}>
    <Router initialRouteName="home" storage={storage}>
      <Route name="home" component={Home} />
      <Route name="help" component={Help} />
      <Route name="settings" component={Settings} />
      <Route name="wallet-details" component={WalletDetails} />
      <Route name="seed-phrase" component={SeedPhrase} />
      <Route name="deposit" component={Deposit} />
      <Route name="swap" component={Swap} />
      <Route name="send" component={Send} />
      <Route name="contacts" component={Contacts} />
      <Route name="add-token" component={Contacts} />
    </Router>
  </StorageProvider>
);

Popup.defaultProps = {
  storage: extension.storage,
};

Popup.propTypes = {
  storage: PropTypes.shape(storagePropType),
};

export default Popup;
