import React from 'react';
import { Layout } from '@components';
import {
  Tabs, Button, Container, LinkButton,
} from '@ui';
import { useTranslation } from 'react-i18next';
import FleekImg from '@assets/icons/Fleek.svg';
import useStyles from './styles';
import Details from './components/Details';
import Data from './components/Data';
import RequestHandler from './components/RequestHandler';
import useRequests from './hooks/useRequests';

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
        <div className={classes.buttonContainer}>
          <Button variant="default" value={t('common.decline')} onClick={() => handleRemoveRequest(requests[currentRequest].id)} style={{ width: '48%' }} />
          <Button variant="rainbow" value={t('common.confirm')} onClick={() => handleRemoveRequest(requests[currentRequest].id)} style={{ width: '48%' }} />
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
