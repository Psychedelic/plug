import React, { useEffect, useState } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import { PortRPC } from '@psychedelic/browser-rpc';
import i18n from 'i18next';
import { useDispatch } from 'react-redux';
import {
  Button,
  Container,
  IncomingAction,
  Layout, TokenIcon, DisplayBox,
} from '@components';
import PropTypes from 'prop-types';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { setAccountInfo } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { reviewPendingTransaction } from '@modules/storageManager';
import initConfig from '../../../../locales';
import useStyles from './styles';

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

  const [loading, setLoading] = useState('');
  const [handled, setHandled] = useState(false);

  const { url, icons } = metadata || {};
  const {
    canisterId, symbol, standard, logo,
  } = args || {};

  const handleImportToken = async (status) => {
    setLoading(status);
    reviewPendingTransaction(transactionId, () => { });
    const success = await portRPC.call('handleRequestImportToken', [
      { status, token: { canisterId, standard, logo } },
      callId,
      portId,
      transactionId,
    ]);
    setHandled(true);
    if (success) {
      window.close();
    }
    setLoading('');
  };

  useEffect(() => {
    setOnTimeout(() => () => {
      handleImportToken(CONNECTION_STATUS.refused);
    });
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      if (Object.keys(state?.wallets).length) {
        dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
      }
    });
  }, []);

  window.onbeforeunload = () => {
    if (!handled) {
      handleImportToken(CONNECTION_STATUS.refused);
    }
  };

  const isAccepting = loading === CONNECTION_STATUS.accepted;
  const isRefusing = loading === CONNECTION_STATUS.refused;

  return (
    <Layout disableProfile disableNavigation incStatus>
      <div className={classes.padTop}>
        <Container className={classes.container}>
          <IncomingAction url={url} image={icons[0] || null} action={t('addToken.importTitle')} />

          <DisplayBox
            title={symbol}
            subtitle={canisterId}
            img={(
              <TokenIcon
                image={logo}
                className={classes.tokenImage}
                symbol={symbol}
              />
)}
          />

          <div className={classes.buttonContainer}>
            <Button
              variant="default"
              value={t('common.decline')}
              onClick={() => handleImportToken(CONNECTION_STATUS.refused)}
              style={{ width: '96%' }}
              loading={isRefusing}
              disabled={isAccepting}
              fullWidth
            />
            <Button
              variant="rainbow"
              value={t('common.allow')}
              onClick={() => handleImportToken(CONNECTION_STATUS.accepted)}
              fullWidth
              style={{ width: '96%' }}
              loading={isAccepting}
              disabled={isRefusing}
              wrapperStyle={{ textAlign: 'right' }}
            />
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default ImportToken;

ImportToken.propTypes = {
  args: PropTypes.string.isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.objectOf(PropTypes.string).isRequired,
  setOnTimeout: PropTypes.func.isRequired,
  transactionId: PropTypes.string.isRequired,
};
