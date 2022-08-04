import { BrowserRPC } from '@psychedelic/browser-rpc';
import { Provider } from '@psychedelic/plug-inpage-provider';

const clientRPC = new BrowserRPC(window, {
  name: 'plug-inpage-provider',
  target: 'plug-content-script',
  timeout: 20000,
});

clientRPC.start();

const plugProvider = new Provider(clientRPC, window);
const ic = window.ic || {};

plugProvider.init();

/* eslint-disable no-console */
window.ic = {
  ...ic,
  plug: plugProvider,
};

export default plugProvider;
