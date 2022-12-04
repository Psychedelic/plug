import React, { useEffect, useState } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import { PortRPC } from '@psychedelic/browser-rpc';
import i18n from 'i18next';
import { useDispatch } from 'react-redux';
import {
  Button,
  Container,
  IncomingAction,
  Layout,
} from '@components';
import PropTypes from 'prop-types';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { setAccountInfo } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { reviewPendingTransaction } from '@modules/storageManager';

import { TransactionBox, WarningMessage } from './components';
import initConfig from '../../../../locales';
import useStyles from './styles';

i18n.use(initReactI18next).init(initConfig);

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const SignMessage = ({
  args, metadata, callId, portId, setOnTimeout, transactionId,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState('');
  const [handled, setHandled] = useState(false);

  const { url, icon, messageToSign } = metadata || {};
  const {
    canisterId, standard, logo,
  } = args || {};

  const handleSignMessage = async (status) => {
    setLoading(status);
    await reviewPendingTransaction(transactionId);
    const success = await portRPC.call('handleRequestSignMessage', [
      { status, token: { canisterId, standard, logo }, messageToSign },
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
      handleSignMessage(CONNECTION_STATUS.refused);
    });
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      if (Object.keys(state?.wallets).length) {
        dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
      }
    });
  }, []);

  window.onbeforeunload = () => {
    if (!handled) {
      handleSignMessage(CONNECTION_STATUS.refused);
    }
  };

  const isAccepting = loading === CONNECTION_STATUS.accepted;
  const isRefusing = loading === CONNECTION_STATUS.refused;

  return (
    <Layout disableProfile disableNavigation incStatus>
      <div className={classes.padTop}>
        <Container className={classes.container}>
          <IncomingAction url={url} image={icon || null} action={t('signMessage.importTitle')} />
          <TransactionBox
            transactionMessage={messageToSign}
            dappImage={icon}
          />
          <WarningMessage />
          <div className={classes.buttonContainer}>
            <Button
              variant="default"
              value={t('common.decline')}
              onClick={() => handleSignMessage(CONNECTION_STATUS.refused)}
              style={{ width: '96%' }}
              loading={isRefusing}
              disabled={isAccepting}
              fullWidth
            />
            <Button
              variant="rainbow"
              value={t('common.allow')}
              onClick={() => handleSignMessage(CONNECTION_STATUS.accepted)}
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

export default SignMessage;

SignMessage.propTypes = {
  args: PropTypes.string.isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.objectOf(PropTypes.string).isRequired,
  setOnTimeout: PropTypes.func.isRequired,
  transactionId: PropTypes.string.isRequired,
};