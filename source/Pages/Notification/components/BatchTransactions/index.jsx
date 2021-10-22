import React, { useEffect } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import {
  Button, Tabs, LinkButton, theme,
} from '@ui';
import i18n from 'i18next';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { useTabs } from '@hooks';
import store from '@redux/store';
import PropTypes from 'prop-types';
import { Layout } from '@components';
import { Provider, useDispatch } from 'react-redux';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { setAccountInfo } from '@redux/wallet';
import initConfig from '../../../../locales';
import useStyles from './styles';
import Stepper from './components/Stepper';
import useRPCTransactions from './hooks/useRPCTransactions';
import Details from '../Sign/components/Details';
import Data from '../Sign/components/Data';

i18n.use(initReactI18next).init(initConfig);

const BatchTransactions = ({
  args, callId, portId, metadata,
}) => {
  const { transactions } = args || {};
  const { url, icons } = metadata;

  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const { selectedTab, handleChangeTab } = useTabs();

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      if (state?.wallets?.length) {
        dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
      }
    });
  }, []);

  const {
    showNext,
    showPrevious,

    confirm,
    confirmAll,
    declineAll,

    transactions: _transactions,
    transaction,
    currentIndex,
    response,

    data,
    loading,
  } = useRPCTransactions(transactions, callId, portId);

  const isCurrentTransaction = (response?.length ?? 0) === currentIndex;
  const transactionsCount = _transactions.length;

  const tabs = [
    {
      label: t('assetsWarning.details.title'),
      component: <Details
        url={url}
        icon={icons?.[0] || null}
        request={transaction}
      />,
    },
    {
      label: t('assetsWarning.data.title'),
      component: <Data
        data={data}
        withArguments
      />,
    },
  ];

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout disableProfile disableNavigation>
          {transactionsCount > 1 && (
            <Stepper
              isActive={isCurrentTransaction}
              current={currentIndex + 1}
              total={transactionsCount}
              showNext={showNext}
              showPrevious={showPrevious}
            />
          )}
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
                onClick={declineAll}
                fullWidth
                style={{ width: '96%' }}
                disabled={loading || !isCurrentTransaction}
              />
              <Button
                variant="rainbow"
                value={t('common.confirm')}
                onClick={confirm}
                fullWidth
                style={{ width: '96%' }}
                wrapperStyle={{ textAlign: 'right' }}
                loading={loading}
                disabled={!isCurrentTransaction}
              />
            </div>
            {transactionsCount > 1 && (
              <LinkButton
                value={`${t('common.confirm')} ${transactionsCount} ${t(
                  'transfer.transactions',
                )}`}
                onClick={confirmAll}
                style={{ marginTop: 24 }}
              />
            )}
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
};
