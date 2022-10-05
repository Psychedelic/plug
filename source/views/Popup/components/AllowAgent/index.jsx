import React, { useEffect, useState } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import { PortRPC } from '@psychedelic/browser-rpc';
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
  Layout,
} from '@components';
import store from '@redux/store';
import extension from 'extensionizer';
import PropTypes from 'prop-types';
import { ChevronDown } from 'react-feather';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { setAccountInfo } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import clsx from 'clsx';
import { reviewPendingTransaction } from '@modules/storageManager';
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
  args, metadata, callId, portId, setOnTimeout, transactionId,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [handled, setHandled] = useState(false);

  const { url, icons } = metadata || {};

  const canisters = args?.canistersInfo || [];
  const canistersLength = canisters.length;
  const maxDispayCanisters = 2;

  const displayCanister = canistersLength < maxDispayCanisters
    ? canistersLength : maxDispayCanisters;

  const [expand, setExpand] = useState(false);

  const handleAllowAgent = async (status) => {
    reviewPendingTransaction(transactionId, () => {});
    const success = await portRPC.call('handleAllowAgent', [
      url,
      { status, whitelist: args.whitelist || {}, metadata },
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
      handleAllowAgent(CONNECTION_STATUS.refused).then(() => {
        setHandled(true);
        window?.close?.();
      });
    });
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      if (Object.keys(state?.wallets).length) {
        dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
      }
    });
  },
  []);

  window.onbeforeunload = () => {
    if (!handled) {
      handleAllowAgent(CONNECTION_STATUS.refused);
    }
  };

  const toggleExpand = () => {
    const height = 430 + 65 * Math.min(canistersLength, expand ? 2 : 5);
    extension.windows.update(extension.windows.WINDOW_ID_CURRENT, {
      height,
    });

    setExpand((prevState) => !prevState);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout disableProfile disableNavigation incStatus>
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
                  {
                    canisters.slice(0, displayCanister).map((canister) => (
                      <CanisterInfoItem key={canister.id} canister={canister} />
                    ))
                  }
                  {
                    expand
                    && canisters.slice(displayCanister).map((canister) => (
                      <CanisterInfoItem key={canister.id} canister={canister} />
                    ))
                  }
                </CanisterInfoContainer>

                {
                  canistersLength > maxDispayCanisters
                  && (
                    <div className={classes.expandContainer} onClick={toggleExpand}>
                      <span className={classes.expand}>
                        {expand ? 'Collapse canisters' : `Review ${canistersLength - maxDispayCanisters} more canisters`}
                      </span>
                      <ChevronDown
                        className={clsx(classes.chevron, expand && classes.rotate)}
                        size={26}
                      />
                    </div>
                  )
                }

                <div className={classes.buttonContainer}>
                  <Button
                    variant="default"
                    value={t('common.decline')}
                    onClick={() => handleAllowAgent(CONNECTION_STATUS.refused)}
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
  );
};

export default AllowAgent;

AllowAgent.propTypes = {
  args: PropTypes.string.isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.objectOf(PropTypes.string).isRequired,
  setOnTimeout: PropTypes.func.isRequired,
  transactionId: PropTypes.string.isRequired,
};
