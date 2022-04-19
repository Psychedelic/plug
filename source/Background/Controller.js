import extension from 'extensionizer';
import PlugController from '@psychedelic/plug-controller';
import { BackgroundController } from '@fleekhq/browser-rpc';

import {
  ConnectionModule,
  TransactionModule,
  InformationModule,
} from '@modules';

import NotificationManager from '../lib/NotificationManager';
import {
  getKeyringHandler,
  HANDLER_TYPES,
  getKeyringErrorMessage,
} from './Keyring';
import ERRORS, { SILENT_ERRORS } from './errors';

let keyring = {};

const backgroundController = new BackgroundController({
  name: 'bg-script',
  trustedSources: ['plug-content-script', 'notification-port'],
});

const notificationManager = new NotificationManager(
  extension.extension.getURL('../assets/icons/plug.svg'),
);

backgroundController.start();

export const init = async () => {
  keyring = new PlugController.PlugKeyRing();
  await keyring.init();
  if (keyring.isUnlocked) {
    const state = await keyring?.getState();
    if (!state?.wallets?.length > 0) {
      await keyring.lock();
    }
  }
};

// keyring handlers
extension.runtime.onMessage.addListener((message, _, sendResponse) => {
  const handleOnMessage = () => {
    const { params, type } = message;
    const keyringHandler = getKeyringHandler(type, keyring);
    if (!keyringHandler) return;

    keyringHandler(params)
      .then((res) => sendResponse(res))
      .catch((e) => {
        const keyringErrorMessage = getKeyringErrorMessage(type);
        const errorMessage = keyringErrorMessage
          ? `Unexpected error while ${keyringErrorMessage}`
          : 'Unexpected error';
        console.warn(errorMessage);
        console.warn(e);
      });
  };

  if (!keyring) {
    init().then(() => {
      handleOnMessage();
    });
  } else {
    handleOnMessage();
  }

  // Usually we would not return, but it seems firefox needs us to
  return true; // eslint-disable-line
});

const isInitialized = async () => {
  await keyring?.init();
  const getLocks = getKeyringHandler(HANDLER_TYPES.GET_LOCKS, keyring);

  if (!getLocks) return false;

  const locks = await getLocks();

  return locks?.isInitialized;
};

const secureController = async (callback, controller) => {
  const initialized = await isInitialized();
  if (!initialized) {
    extension.tabs.create({
      url: 'options.html',
    });
    callback(ERRORS.INITIALIZED_ERROR, null);
    return;
  }

  try {
    await controller();
  } catch (e) {
    notificationManager.notificateError(e.message);
  }
};

let connectionModule;
let transactionModule;
let informationModule;
init().then(() => {
  // Exposing module methods
  connectionModule = new ConnectionModule(
    backgroundController,
    secureController,
    keyring,
  );
  connectionModule.exposeMethods();

  transactionModule = new TransactionModule(backgroundController, secureController, keyring);
  transactionModule.exposeMethods();

  informationModule = new InformationModule(backgroundController, secureController, keyring);
  informationModule.exposeMethods();
});

backgroundController.exposeController(
  'handleError',
  async (opts, metadata, errorMessage) => {
    const { message, sender, callback } = opts;
    const { id: callId } = message.data.data;
    const { id: portId } = sender;

    if (
      !Object.values(SILENT_ERRORS)
        .map((e) => e.message)
        .includes(errorMessage)
    ) {
      notificationManager.notificateError(errorMessage);
    }

    callback(ERRORS.CLIENT_ERROR(errorMessage), null, [{ portId, callId }]);
    callback(null, true);
  },
);

backgroundController.exposeController(
  'handleTimeout',
  async (opts, metadata, errorMessage) => {
    const { message, sender, callback } = opts;
    const { id: callId } = message.data.data;
    const { id: portId } = sender;

    notificationManager.notificateTimeout(errorMessage);

    callback(ERRORS.CLIENT_ERROR(errorMessage), null, [{ portId, callId }]);
    callback(null, true);
  },
);

export default backgroundController;
