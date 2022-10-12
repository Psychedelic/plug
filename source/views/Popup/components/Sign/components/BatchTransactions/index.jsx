import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import PropTypes from 'prop-types';
import extension from 'extensionizer';

import {
  Button, Tabs, theme,
  Layout,
} from '@components';
import { useTabs } from '@hooks';
import store from '@redux/store';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { setAccountInfo } from '@redux/wallet';

import initConfig from '../../../../../../locales';
import useStyles from './styles';
import useRPCTransactions from './hooks/useRPCTransactions';
import Details from '../Details';
import Data from '../Data';
import SIZES from '../../constants';

i18n.use(initReactI18next).init(initConfig);

const BatchTransactions = ({
  args, callId, portId, metadata, setOnTimeout, transactionId,
}) => {
  const { transactions } = args || {};
  const { url, icons } = metadata;

  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const { selectedTab, handleChangeTab } = useTabs();

  const {
    confirm,
    decline,
    transactions: _transactions,
    data,
    loading,
  } = useRPCTransactions(transactions, callId, portId, transactionId);

  useEffect(() => {
    if (decline) {
      setOnTimeout(() => () => {
        decline();
      });
    }
  }, []);

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      if (Object.keys(state?.wallets).length) {
        dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
      }
    });
  }, []);

  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: transactions?.length <= 3 ? SIZES.batchTransactions : SIZES.batchTransactionsScroll,
    },
  );

  const tabs = [
    {
      label: t('assetsWarning.details.title'),
      component: <Details
        url={url}
        icon={icons?.[0] || null}
        requests={_transactions}
      />,
    },
    {
      label: t('assetsWarning.data.title'),
      component: <Data
        transactionsData={data}
        withArguments
      />,
    },
  ];
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout disableProfile disableNavigation>
          <Tabs
            tabs={tabs}
            selectedTab={selectedTab}
            handleChangeTab={handleChangeTab}
          />
          <div className={classes.buttonsWrapper}>
            <div className={classes.buttonContainer}>
              <Button
                variant="default"
                value={t('common.decline')}
                onClick={window.close}
                fullWidth
                style={{ width: '96%' }}
              />
              <Button
                variant="rainbow"
                value={t('common.confirm')}
                onClick={confirm}
                fullWidth
                style={{ width: '96%' }}
                wrapperStyle={{ textAlign: 'right' }}
                loading={loading}
              />
            </div>

          </div>
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};

export default BatchTransactions;

BatchTransactions.propTypes = {
  args: PropTypes.arrayOf(PropTypes.string).isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOnTimeout: PropTypes.func.isRequired,
  transactionId: PropTypes.string.isRequired,
};
