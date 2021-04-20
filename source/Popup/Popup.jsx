import React from 'react';
import PropTypes from 'prop-types';
import extension from 'extensionizer';
import {
  Route,
  Layout,
  Router,
  storagePropType,
} from '@components';

import Home from './Views/Home';

import TestHome from './Views/TestHome';
import TestDetails from './Views/TestDetails';

const Popup = ({ storage }) => (
  <Layout>
    <Home />
    <Router initialRouteName="home" storage={storage}>
      <Route name="home" component={TestHome} />
      <Route name="details" component={TestDetails} />
    </Router>
  </Layout>
);

Popup.defaultProps = {
  storage: extension.storage,
};

Popup.propTypes = {
  storage: PropTypes.shape(storagePropType),
};

export default Popup;
