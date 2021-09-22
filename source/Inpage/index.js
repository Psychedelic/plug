import { BrowserRPC } from '@fleekhq/browser-rpc';
import { Provider } from '@psychedelic/plug-inpage-provider';
import browser from 'webextension-polyfill';

const clientRPC = new BrowserRPC(window, {
  name: 'plug-inpage-provider',
  target: 'plug-content-script',
  timeout: 20000,
});

clientRPC.start();

const plugVersion = browser.runtime.getManifest().version;
const plugProvider = new Provider(clientRPC, plugVersion);
const ic = window.ic || {};

/* eslint-disable no-console */
window.ic = {
  ...ic,
  plug: plugProvider,
};

export default plugProvider;
