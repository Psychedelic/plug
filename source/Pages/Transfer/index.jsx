import React from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import {
  Button, Container, Tabs, LinkButton,
} from '@ui';
import i18n from 'i18next';
import { useTabs } from '@hooks';
import PropTypes from 'prop-types';
import initConfig from '../../locales';
import useStyles from './styles';
import RequestHandler from './components/RequestHandler';
import useRequests from './hooks/useRequests';
import Details from './components/Details';
import Data from './components/Data';

i18n.use(initReactI18next).init(initConfig);

const Transfer = ({
  incomingRequests, callId, portId, metadata,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { url, icons } = metadata;

  const { selectedTab, handleChangeTab } = useTabs();

  const {
    requests,
    currentRequest,
    data,
    handleSetPreviousRequest,
    handleSetNextRequest,
    handleRequest,
    handleDeclineAll,
  } = useRequests(incomingRequests, callId, portId);

  const requestCount = requests.length;

  const tabs = [
    {
      label: t('cycleTransactions.details'),
      component: <Details
        url={url}
        image={icons[0] || null}
        amount={requestCount > 0 ? requests[currentRequest].amount : 0}
        requestCount={requestCount}
      />,
    },
    {
      label: t('cycleTransactions.data'),
      component: <Data
        data={data}
        requestCount={requestCount}
      />,
    },
  ];

  return (
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
      {
        requestCount > 0
        && (
          <>
            <Tabs tabs={tabs} selectedTab={selectedTab} handleChangeTab={handleChangeTab} />
            <Container>
              <div className={classes.buttonContainer}>
                <Button variant="default" value={t('common.decline')} onClick={() => handleRequest(requests[currentRequest], 'declined')} style={{ width: '48%' }} />
                <Button variant="rainbow" value={t('common.confirm')} onClick={() => handleRequest(requests[currentRequest], 'accepted')} style={{ width: '48%' }} />
              </div>
              {
                requestCount > 1
                && (
                  <LinkButton
                    value={`${t('cycleTransactions.decline')} ${requestCount} ${t('cycleTransactions.transactions')}`}
                    onClick={() => handleDeclineAll()}
                    style={{ marginTop: 24 }}
                  />
                )
              }
            </Container>
          </>
        )
      }
    </>
  );
};

export default Transfer;

Transfer.propTypes = {
  incomingRequests: PropTypes.arrayOf(PropTypes.string).isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.arrayOf(PropTypes.string).isRequired,
};
