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

  const { query } = qs.parseUrl(window.location.href);

  const { callId } = query;

  const portId = parseInt(query.portId, 10);

  const {
    requests,
    currentRequest,
    data,
    handleSetPreviousRequest,
    handleSetNextRequest,
    handleRequest,
    handleDeclineAll,
    loading,
  } = useRequests(callId, portId);

  const requestCount = requests.length;

  if (loading || requestCount === 0) return null;

  const tabs = [
    {
      label: t('cycleTransactions.details'),
      component: <Details
        url={requests[currentRequest].url}
        image={requests[currentRequest].icon}
        cycles={requests[currentRequest].options.cycles}
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
              <Tabs tabs={tabs} />
              <Container>
                <div className={classes.buttonContainer}>
                  <Button variant="default" value={t('common.decline')} onClick={() => handleRequest(requests[currentRequest].id, 'declined')} style={{ width: '48%' }} />
                  <Button variant="rainbow" value={t('common.confirm')} onClick={() => handleRequest(requests[currentRequest].id, 'accepted')} style={{ width: '48%' }} />
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
