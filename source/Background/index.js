import extension from 'extensionizer';
import { init } from './Controller';

extension.runtime.onInstalled.addListener(async () => {
  await init();
  /* eslint-disable-next-line no-console */
  console.log('controller instantiated on install');
});

extension.runtime.onStartup.addListener(async () => {
  await init();
  /* eslint-disable-next-line no-console */
  console.log('controller instantiated on startup');
});
