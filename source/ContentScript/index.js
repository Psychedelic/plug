import { ProxyRPC } from '@fleekhq/browser-rpc';

import { injectScript } from './utils';

const serverRPC = new ProxyRPC(window, {
  name: 'plug-content-script',
  target: 'plug-inpage-provider',
});

serverRPC.exposeHandler('test', (props, name) => {
  const { callback } = props;
  const result = `hello ${name}!!!`;
  callback(null, result);
});

serverRPC.start();

injectScript(null, INPAGE_SCRIPT);

export {};
