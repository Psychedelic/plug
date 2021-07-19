import { BrowserRPC } from '@fleekhq/browser-rpc';
import { Provider } from '@psychedelic/plug-inpage-provider';

const clientRPC = new BrowserRPC(window, {
  name: 'plug-inpage-provider',
  target: 'plug-content-script',
  timeout: 20000,
});

clientRPC.start();

const plugProvider = new Provider(clientRPC);

const ic = window.ic || {};

/* eslint-disable no-console */
window.ic = {
  ...ic,
  plug: plugProvider,
};
