import * as React from 'react';
// import browser from 'webextension-polyfill'
import { ConnectionStatus } from '@components';
import NavBar from './components/NavBar';

/* function openWebPage(url) {
  return browser.tabs.create({ url })
} */

const Popup = () => (
  <>
    <ConnectionStatus status="plugged" web="fleek.ooo" /> { /* layout will wrap this later */}
    <NavBar />
  </>
);

export default Popup;
