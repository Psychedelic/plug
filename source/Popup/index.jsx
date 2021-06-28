import React, { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { theme } from '@ui';
import { Provider } from 'react-redux';
import browser from 'webextension-polyfill';
import { KeyRing } from '@background';
import Popup from './Popup';
import initConfig from '../locales';
import store from '../redux/store';

i18n.use(initReactI18next).init(initConfig);

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(async () => {
    if (KeyRing.isInitialized) {
      if (KeyRing.isUnlocked) {
        setInitialRoute('home');
      } else {
        setInitialRoute('login');
      }
    } else {
      browser.tabs.create({ url: 'options.html' });
    }
  }, []);

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
