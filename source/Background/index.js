import { init } from './Controller';

chrome.runtime.onInstalled.addListener(async () => {
  console.log('onInstalled ran');
  await init();
  /* eslint-disable-next-line no-console */
  console.log('controller started');
});
