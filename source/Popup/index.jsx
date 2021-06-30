import React, { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { initReactI18next } from 'react-i18next';
import extension from 'extensionizer';
import browser from 'webextension-polyfill';

import { theme } from '@ui';
import { HANDLER_TYPES } from '@background/Keyring';
import Popup from './Popup';
import initConfig from '../locales';
import store from '../redux/store';

i18n.use(initReactI18next).init(initConfig);

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    extension.runtime.sendMessage({ type: HANDLER_TYPES.GET_LOCKS, params: {} }, (locks) => {
      if (locks?.isInitialized) {
        if (locks?.isUnlocked) {
          setInitialRoute('home');
        } else {
          setInitialRoute('login');
        }
      } else {
        browser.tabs.create({ url: 'options.html' });
      }
    });
  });

  return (
    initialRoute
    && (
      <StrictMode>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Popup initialRoute={initialRoute} />
          </ThemeProvider>
        </Provider>
      </StrictMode>
    )
  );
};

ReactDOM.render(<App />, document.getElementById('popup-root'));
