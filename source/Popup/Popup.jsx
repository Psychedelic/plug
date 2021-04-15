import * as React from 'react';
// import browser from 'webextension-polyfill'
import { Layout } from '@components';
import Home from './Views/Home';

/* function openWebPage(url) {
  return browser.tabs.create({ url })
} */

const Popup = () => (
  <Layout>
    <Home />
  </Layout>
);

export default Popup;
