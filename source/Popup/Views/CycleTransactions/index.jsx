import React from 'react';
import { Layout } from '@components';
import {
  Tabs, Button, Container, LinkButton, Alert,
} from '@ui';
import { useTranslation } from 'react-i18next';
import FleekImg from '@assets/icons/Fleek.svg';
import useStyles from './styles';
import Details from './components/Details';
import Data from './components/Data';
import RequestHandler from './components/RequestHandler';
import useRequests from './hooks/useRequests';

const AVAILABLE_CYCLES = 100;

const CycleTransactions = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const {
    requests,
    currentRequest,
    data,
    handleSetPreviousRequest,
    handleSetNextRequest,
    handleRemoveRequest,
  } = useRequests();

  const tabs = [
    {
      label: t('cycleTransactions.details'),
      component: <Details
        url={requests[currentRequest].url}
        image={FleekImg}
        cycles={requests[currentRequest].cycles}
      />,
    },
    {
      label: t('cycleTransactions.data'),
      component: <Data data={data} />,
    },
  ];

  const requestCount = requests.length;
  const { cycles } = requests[currentRequest];
  const enoughCycles = cycles <= AVAILABLE_CYCLES;

  return (
    <Layout>
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
      <Tabs tabs={tabs} />
      <Container>
        {
          !enoughCycles
          && (
            <Alert
              type="warning"
              title={t('cycleTransactions.notEnoughTitle')}
              subtitle={t('cycleTransactions.notEnoughText')}
              startIcon
            />
          )
        }
        <div className={classes.buttonContainer}>
          <Button
            variant="default"
            value={t('common.decline')}
            onClick={() => handleRemoveRequest(requests[currentRequest].id)}
            style={{ width: '48%' }}
          />
          <Button
            variant="rainbow"
            value={t('common.confirm')}
            onClick={() => handleRemoveRequest(requests[currentRequest].id)}
            style={{ width: '48%' }}
            disabled={!enoughCycles}
          />
        </div>
        {
          requestCount > 1
          && <LinkButton value={`${t('cycleTransactions.decline')} ${requestCount} ${t('cycleTransactions.transactions')}`} onClick={() => null} style={{ marginTop: 24 }} />
        }
      </Container>
    </Layout>
  );
};

export default CycleTransactions;
