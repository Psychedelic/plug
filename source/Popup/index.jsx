import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { theme } from '@ui';
import { Provider } from 'react-redux';
import Popup from './Popup';
import initConfig from '../locales';

import store from '../redux/store';

i18n.use(initReactI18next).init(initConfig);

const App = () => (
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Popup />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);

ReactDOM.render(<App />, document.getElementById('popup-root'));
