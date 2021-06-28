import backgroundController from './Controller';
import KeyRing from './Keyring';

backgroundController.start();
KeyRing.init();

/* eslint-disable-next-line no-console */
console.log('controller started');

export { KeyRing };
