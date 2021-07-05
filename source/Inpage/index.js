import { BrowserRPC } from '@fleekhq/browser-rpc';
import { Provider } from '@fleekhq/plug-inpage-provider';

const clientRPC = new BrowserRPC(window, {
  name: 'plug-inpage-provider',
  target: 'plug-content-script',
  timeout: 5000,
});

clientRPC.start();

console.log('YO!');

let publicKey;

clientRPC
  .call('getPublicKey')
  .then((result) => {
    publicKey = result;
  })
  .catch((error) => {
    console.error(error);
  });

const plugProvider = new Provider(clientRPC, publicKey);

const ic = window.ic || {};

/* eslint-disable no-console */
window.ic = {
  ...ic,
  plug: plugProvider,
};
