import React from 'react';
import qs from 'query-string';
import { useTranslation, initReactI18next } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import i18n from 'i18next';
import { Provider } from 'react-redux';

import {
  Button, Container, IncomingAction, theme,
} from '@ui';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import store from '@redux/store';
import { Layout } from '@components';
import extension from 'extensionizer';
import initConfig from '../../../../locales';
import SIZES from '../Transfer/constants';
import useStyles from './styles';

i18n.use(initReactI18next).init(initConfig);

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const AppConnection = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { query } = qs.parseUrl(window.location.href);

  const {
    url,
    icon,
    callId,
    portId,
  } = query;

  const onClickHandler = async (status) => {
    await portRPC.call('handleAppConnect', [url, status, callId, portId]);
    window.close();
  };

  // find way to do this
  // window.onbeforeunload = () => { // if user closes the window, reject connection
  //  onClickHandler(CONNECTION_STATUS.rejected);
  // };

  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: SIZES.appConnectHeight,
    },
  );

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout disableProfile>
          <div className={classes.padTop}>
            <Container>
              <IncomingAction url={url} image={icon} action={t('appConnection.connect')} />
              <div className={classes.buttonContainer}>
                <Button
                  variant="default"
                  value={t('common.decline')}
                  onClick={() => onClickHandler(CONNECTION_STATUS.rejected)}
                  style={{ width: '96%' }}
                  fullWidth
                />
                <Button
                  variant="rainbow"
                  value={t('common.allow')}
                  onClick={() => onClickHandler(CONNECTION_STATUS.accepted)}
                  fullWidth
                  style={{ width: '96%' }}
                  wrapperStyle={{ textAlign: 'right' }}
                />
              </div>
            </Container>
          </div>
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};

export default AppConnection;
