import extension from 'extensionizer';
import backgroundScript from './script';

extension.runtime.onInstalled.addListener(async () => {
  await backgroundScript.init();
  backgroundScript.exposeHandlers();
  /* eslint-disable-next-line no-console */
  console.log('controller instantiated on install');
});

extension.runtime.onStartup.addListener(async () => {
  await backgroundScript.init();
  backgroundScript.exposeHandlers();
  /* eslint-disable-next-line no-console */
  console.log('controller instantiated on startup');
});

backgroundScript.init().then(() => {
  backgroundScript.exposeHandlers();
});
