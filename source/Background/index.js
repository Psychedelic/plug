import { init } from './Controller';

chrome.runtime.onInstalled.addListener(async () => {
  await init();
  /* eslint-disable-next-line no-console */
  console.log('controller started');
});
