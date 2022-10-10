import React, { StrictMode, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import browser from 'webextension-polyfill';
import { theme } from '@components';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

import ProviderWrapper from '../../shared/ProviderWrapper';
import Popup from './Popup';
import initConfig from '../../locales';
import store from '../../redux/store';

i18n.use(initReactI18next).init(initConfig);

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_LOCKS, params: {} }, (locks) => {
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
        <ProviderWrapper
          store={store}
          theme={theme}
        >
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Popup initialRoute={initialRoute} />
        </ProviderWrapper>
      </StrictMode>
    )
  );
};

ReactDOM.render(<App />, document.getElementById('popup-root'));
