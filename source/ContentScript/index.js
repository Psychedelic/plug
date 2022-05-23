import { ProxyRPC } from '@fleekhq/browser-rpc';
import extensionizer from 'extensionizer';

import { injectScript } from './utils';

const serverRPC = new ProxyRPC(window, {
  name: 'plug-content-script',
  target: 'plug-inpage-provider',
});

const contentPort = extensionizer.runtime.connect({
  name: 'background-content',
});

// Listen for runtime message
extensionizer.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateConnection') {
    // fire an event to get duck
    const event = new CustomEvent('updateConnection');
    console.log("dispatching event to provider", event);
    window.dispatchEvent(event);
  }
});

window.addEventListener('message', (event) => {
  if (event.data.action === 'updatedProvider') {
    contentPort.postMessage({ type: 'updatedProvider', payload: event.data.payload });
  }
}, false);

serverRPC.exposeHandler('test', (props, name) => {
  const { callback } = props;
  const result = `hello ${name}!!!`;
  callback(null, result);
});

serverRPC.start();

injectScript(null, INPAGE_SCRIPT);

export {};
