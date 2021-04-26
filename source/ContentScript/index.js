import { BrowserRPC } from '@fleekhq/browser-rpc';

import { injectScript } from './utils';

const serverRPC = new BrowserRPC(window, {
  name: 'plug-content-script',
  target: 'plug-inpage-provider',
});

serverRPC.exposeHandler('test', (cb, name) => {
  const result = `hello ${name}!!!`;
  cb(null, result);
});

serverRPC.start();

injectScript(null, INPAGE_SCRIPT);

/* eslint-disable no-console */
console.log('helloworld from content script');

export {};
