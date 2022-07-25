import { ProxyRPC } from '@psychedelic/browser-rpc';
import extensionizer from 'extensionizer';

import { injectScript } from './utils';

const serverRPC = new ProxyRPC(window, {
  name: 'plug-content-script',
  target: 'plug-inpage-provider',
});

// Listen for runtime message
extensionizer.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateConnection') {
    const event = new CustomEvent('updateConnection');
    window.dispatchEvent(event);
  }
});

serverRPC.exposeHandler('test', (props, name) => {
  const { callback } = props;
  const result = `hello ${name}!!!`;
  callback(null, result);
});

serverRPC.start();

injectScript(null, INPAGE_SCRIPT);

export {};
