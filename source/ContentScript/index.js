import { BrowserRPC } from '@fleekhq/browser-rpc';

const serverRPC = new BrowserRPC(window, {
  name: 'plug-content-script',
  target: 'plug-inpage-provider',
});

serverRPC.exposeHandler('test', (cb, name) => {
  const result = `hello ${name}!!!`;
  cb(null, result);
});

serverRPC.start();
// eslint-disable-next-line no-console
console.log('helloworld from content script');

export {};
