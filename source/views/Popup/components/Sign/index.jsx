import React, { useEffect, useState } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import { Provider, useDispatch } from 'react-redux';
import {
  Button, Tabs, theme, Layout,
} from '@components';
import i18n from 'i18next';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { useTabs } from '@hooks';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { setAccountInfo } from '@redux/wallet';
import PropTypes from 'prop-types';
import store from '@redux/store';

import useRequest from './hooks/useRequest';
import initConfig from '../../../../locales';
import { Details, Data, WarningModal } from './components';
import useStyles from './styles';

i18n.use(initReactI18next).init(initConfig);

const AssetsWarning = ({
  args, callId, portId, metadata, setOnTimeout, transactionId,
}) => {
  const { t } = useTranslation();
  const { url, icons } = metadata;
  const { selectedTab, handleChangeTab } = useTabs();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [showModal, setShowModal] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const shouldWarn = args?.requestInfo?.shouldWarn;

  const {
    request,
    data,
    handleAccept,
    handleDecline,
  } = useRequest(args, callId, portId, transactionId);
  const handleBackdropClick = (event) => {
    if (showModal) {
      event.preventDefault();
      event.stopPropagation();
      setShowModal(false);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  window.onclose = () => handleDecline();

  const tabs = [
    {
      label: t('assetsWarning.details.title'),
      component: <Details
        url={url}
        icon={icons?.[0] || null}
        toggleModal={toggleModal}
        shouldWarn={shouldWarn}
        requests={[request]}
      />,
    },
    {
      label: t('assetsWarning.data.title'),
      component: <Data
        transactionsData={[{ formItems: data, transaction: request }]}
        withArguments={!shouldWarn}
      />,
    },
  ];

  let continueButtonStyles = {
    width: '96%',
  };

  if (shouldWarn) {
    continueButtonStyles = { ...continueButtonStyles, background: '#EEAC00' };
  }

  useEffect(() => {
    setOnTimeout(() => () => {
      handleDecline().then(() => window?.close?.());
    });
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} },
      (state) => {
        if (Object.keys(state?.wallets).length) {
          dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
        }
      });
  }, []);

  const handleAcceptRequest = () => {
    setAccepted(true);
    handleAccept();
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout disableProfile disableNavigation>
          {
            showModal && (
              <WarningModal toggleModal={() => setShowModal(false)} />
            )
          }
          <div className={classes.backdropContainer} onClick={handleBackdropClick}>
            {showModal && (
              <div
                className={classes.backdropOpacity}
              />
            )}
            <div className={`${classes.mainContainer} ${showModal && classes.backgroundOpacity}`}>
              <Tabs tabs={tabs} selectedTab={selectedTab} handleChangeTab={handleChangeTab} />
              <div className={classes.buttonsWrapper}>
                <div className={classes.buttonContainer}>
                  <Button
                    variant="default"
                    value={t('common.decline')}
                    onClick={() => window.close()}
                    fullWidth
                    style={{ width: '96%' }}
                    disabled={accepted}
                  />
                  <Button
                    variant="rainbow"
                    value={t('common.confirm')}
                    onClick={handleAcceptRequest}
                    fullWidth
                    style={continueButtonStyles}
                    wrapperStyle={{ textAlign: 'right' }}
                    disabled={accepted}
                  />
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};

AssetsWarning.propTypes = {
  args: PropTypes.arrayOf(PropTypes.string).isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOnTimeout: PropTypes.func.isRequired,
  transactionId: PropTypes.string.isRequired,
};

export default AssetsWarning;
