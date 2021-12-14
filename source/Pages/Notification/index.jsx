import React, { useState, useEffect } from 'react';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import ReactDOM from 'react-dom';
import qs from 'query-string';
import { theme } from '@ui';
import extension from 'extensionizer';
import store from '../../redux/store';
import ProviderWrapper from '../../shared/ProviderWrapper';
import Login from '../../Popup/Views/Login';
import AppConnection from './components/AppConnection';
import BatchTransactions from './components/Sign/components/BatchTransactions';
import Transfer from './components/Transfer';
import Balance from './components/Balance';
import Principal from './components/Principal';
import AllowAgent from './components/AllowAgent';
import BurnXTC from './components/BurnXTC';
import Sign from './components/Sign';
import SIZES from './components/Transfer/constants';

const NOTIFICATION_COMPONENTS = {
  batchTransactions: BatchTransactions,
  transfer: Transfer,
  balance: Balance,
  principal: Principal,
  connect: AppConnection,
  allowAgent: AllowAgent,
  burnXTC: BurnXTC,
  sign: Sign,
};

const NotificationContainer = () => {
  const [loggedIn, setLoggedIn] = useState(null);
  const { query } = qs.parseUrl(window.location.href);
  const [onTimeout, setOnTimeout] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const {
    callId, metadataJson = '{}', argsJson = '{}', type, portId,
  } = query;
  const metadata = JSON.parse(metadataJson || '{}');
  const args = JSON.parse(argsJson || '{}'); // single request for now

  useEffect(() => {
    let logged = false;
    try {
      sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
        if (state?.wallets?.length) {
          sendMessage({ type: HANDLER_TYPES.GET_LOCKS, params: {} }, (locks) => {
            if (locks?.isUnlocked) {
              logged = true;
            }
          });
        }
      });
    } catch (e) {
      logged = false;
    }
    setLoggedIn(logged);
    extension.windows.update(extension.windows.WINDOW_ID_CURRENT, {
      height: logged
        ? SIZES.appConnectHeight
        : SIZES.loginHeight,
    });
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

  window.onclose = () => onTimeout?.();

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
            />
          )
          : <Login redirect={handleLogin} />
      }
    </ProviderWrapper>
  );
};

ReactDOM.render(<NotificationContainer />, document.getElementById('notification-root'));
