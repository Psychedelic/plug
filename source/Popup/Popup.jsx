import * as React from 'react';
// import browser from 'webextension-polyfill'
import ConnectionStatus from './components/ConnectionStatus';

/* function openWebPage(url) {
  return browser.tabs.create({ url })
} */

const Popup = () => (
  <div>
    <ConnectionStatus status="incomingConnection" web="fleek.ooo" />
  </div>
);

export default Popup;
