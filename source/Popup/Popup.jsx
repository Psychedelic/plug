import * as React from 'react';
// import browser from 'webextension-polyfill'
import ConnectionStatus from './components/ConnectionStatus';

/* function openWebPage(url) {
  return browser.tabs.create({ url })
} */

const Popup = () => (
  <ConnectionStatus status="plugged" web="fleek.ooo" />
);

export default Popup;
