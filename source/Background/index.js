import extension from 'extensionizer';
import { init } from './Controller';

extension.runtime.onInstalled.addListener(async () => {
  await init();
  /* eslint-disable-next-line no-console */
  console.log('controller started');
});

extension.runtime.onStartup.addListener(async () => {
  await init();
  /* eslint-disable-next-line no-console */
  console.log('controller started');
});

extension.runtime.onConnect.addListener(async () => {
  await init();
  /* eslint-disable-next-line no-console */
  console.log('controller started');
});
