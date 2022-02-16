import { BrowserRPC } from '@fleekhq/browser-rpc';
import { Provider } from '@psychedelic/plug-inpage-provider';

const clientRPC = new BrowserRPC(window, {
  name: 'plug-inpage-provider',
  target: 'plug-content-script',
  timeout: 20000,
});

clientRPC.start();
const ic = window.ic || {};
const plugProvider = new Provider(clientRPC);
plugProvider.init();

window.ic = {
  ...ic,
  plug: plugProvider,
};
/* eslint-disable no-console */
export default plugProvider;
