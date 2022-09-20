import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Router,
} from '@components';
import Home from './Views/Home';
import Help from './Views/Help';
import Settings from './Views/Settings';
import WalletDetails from './Views/WalletDetails';
import SeedPhrase from './Views/SeedPhrase';
import Deposit from './Views/Deposit';
// import Swap from './Views/Swap';
import Send from './Views/SendFlow';
import Contacts from './Views/Contacts';
import AddToken from './Views/AddToken';
import AddNFT from './Views/AddNFT';
import ExportIdentity from './Views/ExportIdentity';
import Login from './Views/Login';
import ErrorScreen from './Views/Error';
import SendErrorScreen from './Views/SendError';
import NFTDetails from './Views/NFTDetails';
import SendNFT from './Views/SendNFT';
import ClockError from './Views/ClockError';
import Network from './Views/Network';
import NetworkCreation from './Views/NetworkCreation';
import ImportWallet from './Views/ImportWallet';

const Popup = ({ initialRoute }) => (
  <Router initialRouteName={initialRoute}>
    <Route name="login" component={Login} />
    <Route name="home" component={Home} />
    <Route name="help" component={Help} />
    <Route name="settings" component={Settings} />
    <Route name="wallet-details" component={WalletDetails} />
    <Route name="seed-phrase" component={SeedPhrase} />
    <Route name="deposit" component={Deposit} />
    {/* <Route name="swap" component={Swap} /> */}
    <Route name="clockError" component={ClockError} />
    <Route name="import-wallet" component={ImportWallet} />
    <Route name="send" component={Send} />
    <Route name="contacts" component={Contacts} />
    <Route name="error" component={ErrorScreen} />
    <Route name="send-error" component={SendErrorScreen} />
    <Route name="add-token" component={AddToken} />
    <Route name="add-nft" component={AddNFT} />
    <Route name="export-identity" component={ExportIdentity} />
    <Route name="nft-details" component={NFTDetails} />
    <Route name="send-nft" component={SendNFT} />
    <Route name="network" component={Network} />
    <Route name="create-network" component={NetworkCreation} />
  </Router>
);

Popup.propTypes = {
  initialRoute: PropTypes.string.isRequired,
};

export default Popup;