import { BrowserRPC } from '@fleekhq/browser-rpc';
import { Provider } from '@fleekhq/plug-inpage-provider';
import extension from 'extensionizer';
import reduxicp from '@redux/icp';
import { HANDLER_TYPES } from '@background/Keyring';

const clientRPC = new BrowserRPC(window, {
  name: 'plug-inpage-provider',
  target: 'plug-content-script',
  timeout: 5000,
});

clientRPC.start();

console.log(reduxicp);

const publicKey = extension.runtime.sendMessage({
  type: HANDLER_TYPES.GET_STATUS,
  params: {},
}, (keyringStatus) => keyringStatus.currentWalletId);

const plugProvider = new Provider(clientRPC, publicKey);

const ic = window.ic || {};

/* eslint-disable no-console */
window.ic = {
  ...ic,
  plug: plugProvider,
};
