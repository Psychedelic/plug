import * as React from 'react';
import PropTypes from 'prop-types';
import extension from 'extensionizer';
import {
  Route,
  Router,
  storagePropType,
} from '@components';
import Welcome from './Views/Welcome';

const Options = ({ storage }) => (
  <Router initialRouteName="welcome" storage={storage}>
    <Route name="welcome" component={Welcome} />
  </Router>
);

export default Options;

Options.defaultProps = {
  storage: extension.storage,
};

Options.propTypes = {
  storage: PropTypes.shape(storagePropType),
};
