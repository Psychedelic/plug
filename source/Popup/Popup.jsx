import * as React from 'react';
// import browser from 'webextension-polyfill'
import { ConnectionStatus } from '@components';
/* function openWebPage(url) {
  return browser.tabs.create({ url })
} */

const Popup = () => (
  <ConnectionStatus status="plugged" web="fleek.ooo" />
);

export default Popup;
