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

/* eslint-disable no-console */
window.ic = {
  ...ic,
  plug: plugProvider,
  requestAccess: async (appName) => {
    const res = await clientRPC.call('requestAccess', [appName], {
      timeout: 0,
    });
    console.log(res);
  },
  undefinedMethod: async () => {
    const res = await clientRPC.call('undefinedMethod');
    console.log(res);
  },
};
