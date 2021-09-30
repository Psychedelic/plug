import React, { useEffect, useState } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import { PortRPC } from '@fleekhq/browser-rpc';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import i18n from 'i18next';
import { Provider, useDispatch } from 'react-redux';
import {
  Button,
  Container,
  IncomingAction,
  theme,
  CanisterInfoContainer,
  CanisterInfoItem,
} from '@ui';
import store from '@redux/store';
import { Layout } from '@components';
import extension from 'extensionizer';
import PropTypes from 'prop-types';

import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { setAccountInfo } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import ErrorScreen from '../NotificationError';
import initConfig from '../../../../locales';

import useStyles from './styles';

i18n.use(initReactI18next).init(initConfig);

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const AllowAgent = ({
  args, metadata, callId, portId,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  const { url, icons } = metadata || {};

  const handleAllowAgent = async (status) => {
    const success = await portRPC.call('handleAllowAgent', [
      url,
      { status, whitelist: args?.whitelist },
      callId,
      portId,
    ]);
    if (success) {
      window.close();
    }
    setError(!success);
  };

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      if (state?.wallets?.length) {
        dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
      }
    });

    if (!args?.updateWhitelist || args?.showList) {
      extension.windows.update(extension.windows.WINDOW_ID_CURRENT, {
        height: Math.min(422 + 37 * args?.whitelist.length || 0, 600),
      });
    } else {
      handleAllowAgent(CONNECTION_STATUS.accepted).then(() => window?.close?.());
    }
  }, []);

  return !args?.updateWhitelist || args?.showList ? (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout disableProfile incStatus>
          {error ? (
            <ErrorScreen />
          ) : (
            <div className={classes.padTop}>
              <Container>
                <IncomingAction
                  url={url}
                  image={icons[0] || null}
                  action={t('whitelist.title')}
                />

                <CanisterInfoContainer>
                  {args?.canistersInfo?.map((canister) => (
                    <CanisterInfoItem key={canister.id} canister={canister} />
                  ))}
                </CanisterInfoContainer>

                <div className={classes.buttonContainer}>
                  <Button
                    variant="default"
                    value={t('common.decline')}
                    onClick={() => handleAllowAgent(
                      args?.updateWhitelist
                        ? CONNECTION_STATUS.rejectedAgent
                        : CONNECTION_STATUS.rejected,
                    )}
                    style={{ width: '96%' }}
                    fullWidth
                  />
                  <Button
                    variant="rainbow"
                    value={t('common.allow')}
                    onClick={() => handleAllowAgent(CONNECTION_STATUS.accepted)}
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
  ) : (
    <div style={{ display: 'none' }} />
  );
};

export default AllowAgent;

AllowAgent.propTypes = {
  args: PropTypes.string.isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.objectOf(PropTypes.string).isRequired,
};
