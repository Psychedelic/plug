import React from 'react';
import ReactDOM from 'react-dom';
import qs from 'query-string';
import { useTranslation, initReactI18next } from 'react-i18next';
import { Layout } from '@components';
import {
  Button, Container, theme, Tabs, LinkButton,
} from '@ui';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import i18n from 'i18next';

import { useTabs } from '@hooks';
import initConfig from '../../locales';
import useStyles from './styles';

import RequestHandler from './components/RequestHandler';
import useRequests from './hooks/useRequests';
import Details from './components/Details';
import Data from './components/Data';

i18n.use(initReactI18next).init(initConfig);

const CycleWithdrawal = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { selectedTab, handleChangeTab } = useTabs();

  const { query } = qs.parseUrl(window.location.href);

  const { callId, metadataJson, incomingRequestsJson } = query;

  const metadata = JSON.parse(metadataJson);
  const incomingRequests = JSON.parse(incomingRequestsJson);

  const { url, icons } = metadata;
  const portId = parseInt(query.portId, 10);

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
        cycles={requestCount > 0 ? requests[currentRequest].cycles : 0}
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
      </Layout>
    </ThemeProvider>
  );
};

ReactDOM.render(<CycleWithdrawal />, document.getElementById('cycle-withdrawal-root'));
