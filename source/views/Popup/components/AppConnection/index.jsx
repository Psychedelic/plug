import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import { useTranslation, initReactI18next } from 'react-i18next';
import { PortRPC } from '@psychedelic/browser-rpc';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import i18n from 'i18next';
import { Provider, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Button, Container, IncomingAction, theme,
  Layout,
} from '@components';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import store from '@redux/store';
import extension from 'extensionizer';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { reviewPendingTransaction } from '@modules/storageManager';
import { setAccountInfo } from '@redux/wallet';
import { setICNSData } from '@redux/icns';

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

const AppConnection = ({ setOnTimeout, transactionId, metadata }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const { query } = qs.parseUrl(window.location.href);

  // this needs to be temporal, we should check why wallet info cant access to icns global state -->
  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_ICNS_DATA, params: { refresh: true } },
      (icnsData) => { dispatch(setICNSData(icnsData)); });
  }, []);

  const {
    url,
    icon,
    callId,
    portId,
  } = query;

  const handleResponse = async () => {
    reviewPendingTransaction(transactionId, async () => {});
    const success = await portRPC.call(
      'handleAllowAgent',
      [
        url,
        { status: status || CONNECTION_STATUS.refused, whitelist: {}, metadata },
        callId,
        portId,
        transactionId,
      ],
    );
    if (success) {
      window.close();
    }
    setError(!success);
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
      setStatus(CONNECTION_STATUS.refused);
    }
  };

  useEffect(() => {
    setOnTimeout(() => () => {
      setStatus(CONNECTION_STATUS.refused);
    });
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} },
      (state) => {
        if (Object.keys(state?.wallets).length) {
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
                <IncomingAction url={url} image={icon} action={t('appConnection.connect')} />
                <div className={classes.buttonContainer}>
                  <Button
                    variant="default"
                    value={t('common.decline')}
                    onClick={() => setStatus(CONNECTION_STATUS.refused)}
                    style={{ width: '96%' }}
                    fullWidth
                  />
                  <Button
                    variant="rainbow"
                    value={t('common.allow')}
                    onClick={() => setStatus(CONNECTION_STATUS.accepted)}
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

AppConnection.propTypes = {
  setOnTimeout: PropTypes.func.isRequired,
  transactionId: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    name: PropTypes.string,
    domainUrl: PropTypes.string,
    icons: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default AppConnection;
