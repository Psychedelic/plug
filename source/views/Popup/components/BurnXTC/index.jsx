import React, { useEffect } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import {
  Button, Tabs,
  Layout,
} from '@components';
import i18n from 'i18next';
import { useTabs } from '@hooks';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { setAccountInfo } from '@redux/wallet';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import initConfig from '../../../../locales';
import ErrorScreen from '../NotificationError';
import useStyles from './styles';
import RequestHandler from './components/RequestHandler';
import useRequests from './hooks/useRequests';
import Details from './components/Details';
import Data from './components/Data';

i18n.use(initReactI18next).init(initConfig);

const BurnXTC = ({
  args, callId, portId, metadata, setOnTimeout, transactionId,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { url, icons } = metadata;
  const { selectedTab, handleChangeTab } = useTabs();

  const {
    requests,
    currentRequest,
    data,
    handleSetPreviousRequest,
    handleSetNextRequest,
    handleRequest,
    principalId,
    error,
    loading,
    handleDeclineAll,
  } = useRequests([args], callId, portId, transactionId);

  useEffect(() => {
    setOnTimeout(() => () => {
      handleDeclineAll();
    });
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} },
      (state) => {
        if (Object.keys(state?.wallets).length) {
          dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
        }
      });
  }, []);

  const requestCount = requests.length;
  const tabs = [
    {
      label: t('transfer.details'),
      component: <Details
        url={url}
        image={icons[0] || null}
        amount={(requests?.[currentRequest] || args)?.amount}
        canisterId={args.to}
        requestCount={requestCount}
      />,
    },
    {
      label: t('transfer.data'),
      component: <Data
        data={data}
        principalId={principalId}
      />,
    },
  ];

  return (
    <Layout disableProfile disableNavigation>
      {error ? <ErrorScreen /> : (
        <>
          {
            requestCount > 1
            && (
              <RequestHandler
                currentRequest={currentRequest + 1}
                requests={requestCount}
                handlePrevious={handleSetPreviousRequest}
                handleNext={handleSetNextRequest}
              />
            )
          }
          <>
            <Tabs tabs={tabs} selectedTab={selectedTab} handleChangeTab={handleChangeTab} />
            <div className={classes.buttonsWrapper}>
              <div className={classes.buttonContainer}>
                <Button
                  variant="default"
                  value={t('common.decline')}
                  onClick={window.close}
                  fullWidth
                  style={{ width: '96%' }}
                  disabled={loading}
                />
                <Button
                  variant="rainbow"
                  value={t('common.confirm')}
                  onClick={() => handleRequest(requests[currentRequest], 'accepted')}
                  fullWidth
                  style={{ width: '96%' }}
                  wrapperStyle={{ textAlign: 'right' }}
                  loading={loading}
                />
              </div>
            </div>
          </>
        </>
      )}
    </Layout>
  );
};

export default BurnXTC;

BurnXTC.propTypes = {
  args: PropTypes.arrayOf(PropTypes.string).isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOnTimeout: PropTypes.func.isRequired,
  transactionId: PropTypes.string.isRequired,
};
