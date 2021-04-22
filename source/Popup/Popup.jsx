import React from 'react';
import PropTypes from 'prop-types';
import extension from 'extensionizer';
import {
  Route,
  Router,
  storagePropType,
} from '@components';
import Home from './Views/Home';
import Help from './Views/Help';
import Settings from './Views/Settings';
import WalletName from './Views/WalletName';
import SeedPhrase from './Views/SeedPhrase';

const Popup = ({ storage }) => (
  <Router initialRouteName="home" storage={storage}>
    <Route name="home" component={Home} />
    <Route name="help" component={Help} />
    <Route name="settings" component={Settings} />
    <Route name="wallet-name" component={WalletName} />
    <Route name="seed-phrase" component={SeedPhrase} />
  </Router>
);

Popup.defaultProps = {
  storage: extension.storage,
};

Popup.propTypes = {
  storage: PropTypes.shape(storagePropType),
};

export default Popup;
