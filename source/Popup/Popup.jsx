import * as React from 'react';
// import browser from 'webextension-polyfill'
import { Layout, Actions } from '@components';

/* function openWebPage(url) {
  return browser.tabs.create({ url })
} */

const Popup = () => (
  <Layout>
    <Actions />
  </Layout>
);

export default Popup;
