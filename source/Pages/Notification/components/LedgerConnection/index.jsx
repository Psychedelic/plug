/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import { useTranslation, initReactI18next } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import i18n from 'i18next';
import { Provider, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import TransportWebHID, { Transport } from '@ledgerhq/hw-transport-webhid';
import LedgerApp, { LedgerError, ResponseSign } from '@zondax/ledger-icp';

import {
  Button, Container, IncomingAction, theme,
} from '@ui';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import store from '@redux/store';
import { Layout } from '@components';
import extension from 'extensionizer';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { setAccountInfo } from '@redux/wallet';
import initConfig from '../../../../locales';
import SIZES from '../Transfer/constants';
import ErrorScreen from '../NotificationError';
import useStyles from './styles';

i18n.use(initReactI18next).init(initConfig);

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const LedgerConnection = ({ setOnTimeout }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const { query } = qs.parseUrl(window.location.href);

  const {
    url,
    icon,
    callId,
    portId,
  } = query;

  const handleResponse = async () => {
    sendMessage({ type: HANDLER_TYPES.CONNECTED_LEDGER, params: {} }, () => console.log('se connecto'));
    window.close();
  };

  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: SIZES.appConnectHeight,
    },
  );

  useEffect(async () => {
    if (status) {
      await handleResponse();
    }
  }, [status]);

  window.onbeforeunload = () => {
    if (status === null) {
      setStatus(CONNECTION_STATUS.rejected);
    }
  };

  const handleConnect = async () => {
    try {
      const derivePath = 'm/44\'/223\'/0\'/0/0';
      const transport = await TransportWebHID.create();
      const ledgerApp = new LedgerApp(transport);
      const resp = await ledgerApp.getAddressAndPubKey(derivePath);
      if (resp.returnCode === 28161) {
        throw new Error('Please open the Internet Computer app on your wallet and try again.');
      } else if (resp.returnCode === LedgerError.TransactionRejected) {
        throw new Error('Ledger Wallet is locked. Unlock it and try again.');
        // @ts-ignore
      } else if (resp.returnCode === 65535) {
        throw new Error('Unable to fetch the public key. Please try again.');
      }
      const principal = resp.principalText;
      alert(`Este es tu principal ${principal}`);
      setStatus(CONNECTION_STATUS.accepted);
    } catch (err) {
      if (err.id && err.id === 'NoDeviceFound') {
        throw new Error('No Ledger device found. Is the wallet connected and unlocked?');
      } else if (
        err.message && err.message.includes('cannot open device with path')
      ) {
        throw new Error('Cannot connect to Ledger device. Please close all other wallet applications (e.g. Ledger Live) and try again.');
      } else {
        // Unsupported browser. Data on browser compatibility is taken from https://caniuse.com/webhid
        throw new Error(`Cannot connect to Ledger Wallet. Either you have other wallet applications open (e.g. Ledger Live), or your browser doesn't support WebHID, which is necessary to communicate with your Ledger hardware wallet.\n\nSupported browsers:\n* Chrome (Desktop) v89+\n* Edge v89+\n* Opera v76+\n\nError: ${err}`);
      }
    }
  };

  useEffect(() => {
    setOnTimeout(() => () => {
      setStatus(CONNECTION_STATUS.rejected);
    });
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} },
      (state) => {
        if (state?.wallets?.length) {
          dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
        }
      });
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout disableProfile disableNavigation incStatus>
          {error ? <ErrorScreen /> : (
            <div className={classes.padTop}>
              <Container className={classes.container}>
                <IncomingAction url={url} image={icon} action={t('ledgerConnection.connect')} />
                <div className={classes.buttonContainer}>
                  <Button
                    variant="default"
                    value={t('common.decline')}
                    onClick={() => setStatus(CONNECTION_STATUS.rejected)}
                    style={{ width: '96%' }}
                    fullWidth
                  />
                  <Button
                    variant="rainbow"
                    value={t('common.allow')}
                    onClick={handleConnect}
                    fullWidth
                    style={{ width: '96%' }}
                    wrapperStyle={{ textAlign: 'right' }}
                  />
                </div>
              </Container>
            </div>
          )}
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};

LedgerConnection.propTypes = {
  setOnTimeout: PropTypes.func.isRequired,
};

export default LedgerConnection;
