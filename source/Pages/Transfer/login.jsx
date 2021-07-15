import React, { useState, useEffect } from 'react';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import ReactDOM from 'react-dom';
import qs from 'query-string';
import browser from 'webextension-polyfill';
import { theme } from '@ui';
import Transfer from './index';
import store from '../../redux/store';
import ProviderWrapper from '../../shared/ProviderWrapper';
import Login from '../../Popup/Views/Login';

const TransferLogin = () => {
  const [loggedIn, setLoggedIn] = useState(null);

  const { query } = qs.parseUrl(window.location.href);

  const {
    callId, metadataJson, argsJson, portId,
  } = query;

  const metadata = JSON.parse(metadataJson);
  const incomingRequests = JSON.parse(argsJson); // single request for now

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_LOCKS, params: {} }, (locks) => {
      if (locks?.isInitialized) {
        if (locks?.isUnlocked) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } else {
        browser.tabs.create({ url: 'options.html' });
      }
    });
  });

  const handleLogin = () => setLoggedIn(true);

  return (
    <ProviderWrapper
      store={store}
      theme={theme}
    >
      {
        loggedIn
          ? (
            <Transfer
              incomingRequests={[incomingRequests]}
              callId={callId}
              portId={portId}
              metadata={metadata}
            />
          )
          : <Login redirect={handleLogin} />
      }
    </ProviderWrapper>
  );
};

ReactDOM.render(<TransferLogin />, document.getElementById('transfer-root'));
