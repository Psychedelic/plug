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
  FormItem,
} from '@ui';
import store from '@redux/store';
import { Layout } from '@components';
import PropTypes from 'prop-types';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { setAccountInfo } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import initConfig from '../../../../locales';
import useStyles from './styles';
import { reviewPendingTransaction } from '@modules/storageManager';

i18n.use(initReactI18next).init(initConfig);

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const ImportToken = ({
  args, metadata, callId, portId, setOnTimeout, transactionId,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [handled, setHandled] = useState(false);

  const { url, icons } = metadata || {};
  const { canisterId, symbol, standard, logo, name } = args || {};

  const handleImportToken = async (status) => {
    reviewPendingTransaction(transactionId, () => { });
    const success = await portRPC.call('handleImportToken', [
      { status, token: { canisterId, standard, logo } },
      callId,
      portId,
      transactionId,
    ]);
    setHandled(true);
    if (success) {
      window.close();
    }
    setError(!success);
  };

  useEffect(() => {
    setOnTimeout(() => () => {
      handleImportToken(CONNECTION_STATUS.refused).then(() => {
        setHandled(true);
        window?.close?.();
      });
    });
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      if (state?.wallets?.length) {
        dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
      }
    });
  }, []);

  window.onbeforeunload = () => {
    if (!handled) {
      handleImportToken(CONNECTION_STATUS.refused);
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout disableProfile disableNavigation incStatus>

          <div className={classes.padTop}>
            <Container className={classes.container}>
              <IncomingAction url={url} image={icons[0] || null} action={t('addToken.importTitle')} />

              <div className={classes.confirmToken}>
                <TokenIcon
                  image={logo}
                  className={classes.tokenImage}
                  symbol={symbol}
                />
                <div className={classes.leftContainer}>
                  <Typography variant="h4">{name ?? symbol}</Typography>

                  {amount && <Typography variant="subtitle1">
                    <AssetFormat value={amount} asset={symbol} />
                  </Typography>
                  }
                </div>
              </div>

              <div>
                <FormItem
                  key='canisterId'
                  label='Canister ID'
                  component={<DataDisplay value={canisterId} />}
                  style={{ marginBottom: 24 }}
                  smallLabel
                />

                <FormItem
                  key='standard'
                  label='Standard'
                  component={<DataDisplay value={standard} />}
                  style={{ marginBottom: 24 }}
                  smallLabel
                />
              </div>

              <div className={classes.buttonContainer}>
                <Button
                  variant="default"
                  value={t('common.decline')}
                  onClick={() => handleImportToken(CONNECTION_STATUS.refused)}
                  style={{ width: '96%' }}
                  fullWidth
                />
                <Button
                  variant="rainbow"
                  value={t('common.allow')}
                  onClick={() => handleImportToken(CONNECTION_STATUS.accepted)}
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
  )
};

export default ImportToken;

AllowAgent.propTypes = {
  args: PropTypes.string.isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.objectOf(PropTypes.string).isRequired,
  setOnTimeout: PropTypes.func.isRequired,
};
