import * as React from 'react';
import qs from 'query-string';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import { PortRPC } from '@fleekhq/browser-rpc';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import i18n from 'i18next';
import { theme } from '@ui';
import { initReactI18next } from 'react-i18next';

import initConfig from '../../locales';
import useStyles from './styles';

i18n.use(initReactI18next).init(initConfig);

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const App = () => {
  const classes = useStyles();
  const { query } = qs.parseUrl(window.location.href);

  const { callId } = query;
  const portId = parseInt(query.portId, 10);

  const onClickHandler = async (access) => {
    const res = await portRPC.call('handleAppConnect', [
      access,
      callId,
      portId,
    ]);
    // eslint-disable-next-line no-console
    console.log('res', res);
    window.close();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <div className={classes.card}>
          <div className={classes.title}>Notification Page</div>
          <div style={{ textAlign: 'center' }}>
            {`do you want grant access to ${query.appName} app?`}
          </div>
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onClickHandler('accepted')}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onClickHandler('rejected')}
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
