import React, { useState, useEffect } from 'react';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import ReactDOM from 'react-dom';
import qs from 'query-string';
import { theme } from '@components';
import extension from 'extensionizer';
import { capitalize } from '@material-ui/core';

import store from '@redux/store';
import ProviderWrapper from '@shared/ProviderWrapper';
import Login from '../Extension/Views/Login';
import AppConnection from './components/AppConnection';
import BatchTransactions from './components/Sign/components/BatchTransactions';
import Transfer from './components/Transfer';
import LoginProxy from './components/LoginProxy';
import Principal from './components/Principal';
import AllowAgent from './components/AllowAgent';
import BurnXTC from './components/BurnXTC';
import Sign from './components/Sign';
import SIZES from './components/Transfer/constants';
import ImportToken from './components/ImportToken';

const NOTIFICATION_COMPONENTS = {
  batchTransactions: BatchTransactions,
  connect: AppConnection,
  allowAgent: AllowAgent,
  principal: Principal,
  transfer: Transfer,
  burnXTC: BurnXTC,
  sign: Sign,
  getICNSInfo: LoginProxy,
  requestBalance: LoginProxy,
  requestConnectionData: LoginProxy,
  importToken: ImportToken,
};

const resizeToLogin = () => {
  extension.windows.update(extension.windows.WINDOW_ID_CURRENT, {
    height: SIZES.loginHeight,
  });
};

const NotificationContainer = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { query } = qs.parseUrl(window.location.href);
  const [onTimeout, setOnTimeout] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const {
    callId, metadataJson = '{}', argsJson = '{}', type, portId,
  } = query;
  const metadata = JSON.parse(metadataJson || '{}');
  const args = JSON.parse(argsJson || '{}'); // single request for now
  useEffect(() => {
    try {
      sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
        if (Object.values(state?.wallets).length) {
          sendMessage({ type: HANDLER_TYPES.GET_LOCKS, params: {} }, (locks) => {
            if (locks?.isUnlocked) {
              setLoggedIn(true);
            } else {
              resizeToLogin();
            }
          });
        } else {
          resizeToLogin();
        }
      });
    } catch (e) {
      resizeToLogin();
    }
  }, []);

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (onTimeout) {
      const id = setTimeout(onTimeout, args?.timeout || 120000);
      setTimeoutId(id);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [onTimeout]);

  window.onbeforeunload = () => onTimeout?.();

  const handleLogin = () => setLoggedIn(true);
  const Component = NOTIFICATION_COMPONENTS[type];
  return (
    <ProviderWrapper
      store={store}
      theme={theme}
    >
      {
        loggedIn
          ? (
            <Component
              args={args}
              callId={callId}
              portId={portId}
              metadata={metadata}
              setOnTimeout={setOnTimeout}
              handler={`handle${capitalize(type)}`}
              transactionId={args?.transactionId}
            />
          )
          : <Login redirect={handleLogin} />
      }
    </ProviderWrapper>
  );
};

ReactDOM.render(<NotificationContainer />, document.getElementById('notification-root'));
