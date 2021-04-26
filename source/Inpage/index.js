import { BrowserRPC } from '@fleekhq/browser-rpc';
import { Provider } from '@fleekhq/plug-inpage-provider';

const clientRPC = new BrowserRPC(window, {
  name: 'plug-inpage-provider',
  target: 'plug-content-script',
  timeout: 5000,
});

clientRPC.start();

const plugProvider = new Provider(clientRPC);

const ic = window.ic || {};

window.ic = {
  ...ic,
  plug: plugProvider,
};
