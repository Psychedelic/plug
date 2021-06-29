import PlugController from '@psychedelic/plug-controller';
import { init } from './Controller';

// temporary duplicate keyring (to remove)
const KeyRing =  new PlugController.PlugKeyRing();

KeyRing.init();

/* eslint-disable-next-line import/prefer-default-export */
export { KeyRing };

chrome.runtime.onInstalled.addListener(async () => {
  console.log("onInstalled ran");
  await init();
  /* eslint-disable-next-line no-console */
  console.log('controller started');
});
