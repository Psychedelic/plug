import { BrowserRPC } from '@fleekhq/browser-rpc';
import { Provider } from '@fleekhq/plug-inpage-provider';
import domainMetadata from '../shared/utils/domain-metadata';

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
  requestAccess: async () => {
    const metadata = domainMetadata();
    const icon = metadata.icons[0] || null;

    const res = await clientRPC.call('requestAccess', [metadata.url, icon], {
      timeout: 0,
    });
    console.log(res);
  },
  undefinedMethod: async () => {
    const res = await clientRPC.call('undefinedMethod');
    console.log(res);
  },
};
