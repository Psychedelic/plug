import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const ProviderWrapper = ({ children, store, theme }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      { children }
    </ThemeProvider>
  </Provider>
);

ProviderWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  store: PropTypes.objectOf(PropTypes.string).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  theme: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default ProviderWrapper;
