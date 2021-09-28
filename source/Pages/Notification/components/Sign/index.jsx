import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import { useTranslation, initReactI18next } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import i18n from 'i18next';
import { Provider, useDispatch } from 'react-redux';

import {
  Button, Container, theme,
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

const Sign = ({
  args, callId, portId
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const {requestInfo} = args;

  const handleResponse = async (status) => {
    const success = await portRPC.call('handleSign', [status, args.payload, callId, portId]);

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

  useEffect(() => {
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
        <Layout disableProfile incStatus>
          {error ? <ErrorScreen /> : (
            <div className={classes.padTop}>
              <Container>
                <text>
                  {JSON.stringify(requestInfo, undefined, 2)}
                </text>
                <div className={classes.buttonContainer}>
                  <Button
                    variant="default"
                    value={t('common.decline')}
                    onClick={() => handleResponse(CONNECTION_STATUS.rejected)}
                    style={{ width: '96%' }}
                    fullWidth
                  />
                  <Button
                    variant="rainbow"
                    value={t('common.allow')}
                    onClick={() => handleResponse(CONNECTION_STATUS.accepted)}
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

export default Sign;
