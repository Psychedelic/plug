import * as React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { theme } from '@ui';
import Popup from './Popup';
import initConfig from '../locales';

i18n.use(initReactI18next).init(initConfig);

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Popup />
  </ThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('popup-root'));
