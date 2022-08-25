import extension from 'extensionizer';
import PlugController from '@psychedelic/plug-controller';
import { BackgroundController } from '@psychedelic/browser-rpc';

import {
  ConnectionModule,
  TransactionModule,
  InformationModule,
  NotificationManager,
} from '@modules';

import {
  getKeyringHandler,
  HANDLER_TYPES,
  getKeyringErrorMessage,
  recursiveParseBigint,
} from './Keyring';
import ERRORS, { SILENT_ERRORS } from './errors';

class BackgroundScript {
  constructor() {
    this.keyring = new PlugController.PlugKeyRing();
    this.backgroundController = new BackgroundController({
      name: 'bg-script',
      trustedSources: ['plug-content-script', 'notification-port'],
    });
    this.notificationManager = new NotificationManager(
      extension.extension.getURL('../assets/icons/plug.svg'),
    );
  }

  // Utils
  async isInitialized() {
    await this.keyring?.init();
    const getLocks = getKeyringHandler(HANDLER_TYPES.GET_LOCKS, this.keyring);

    if (!getLocks) return false;

    const locks = await getLocks();

    return locks?.isInitialized;
  }

  async secureController(callback, controller) {
    const initialized = await this.isInitialized();
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
      this.notificationManager.notificateError(e.message);
    }
  }

  static #getControllerModules() {
    return [
      ConnectionModule,
      InformationModule,
      TransactionModule,
    ];
  }

  #hookListener() {
    if (this.hooksExposed) return;
    this.hooksExposed = true;
    extension.runtime.onMessage.addListener((message, _, sendResponse) => {
      // Wait for some one connect to it
      const { params, type } = message;
      const keyringHandler = getKeyringHandler(type, this.keyring);
      keyringHandler?.(params)
        .then((res) => sendResponse(recursiveParseBigint(res)))
        .catch((e) => {
          const keyringErrorMessage = getKeyringErrorMessage(type);
          const errorMessage = keyringErrorMessage
            ? `Unexpected error while ${keyringErrorMessage}`
            : 'Unexpected error';

          // eslint-disable-next-line
          console.warn(errorMessage);
          // eslint-disable-next-line
          console.warn(e);
        });
      // Usually we would not return, but it seems firefox needs us to
      return true; // eslint-disable-line
    });
  }

  #exposeStandaloneMethods() {
    this.backgroundController.exposeController(
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
          this.notificationManager.notificateError(errorMessage);
        }

        callback(ERRORS.CLIENT_ERROR(errorMessage), null, [{ portId, callId }]);
        callback(null, true);
      },
    );

    this.backgroundController.exposeController(
      'handleTimeout',
      async (opts, metadata, errorMessage) => {
        const { message, sender, callback } = opts;
        const { id: callId } = message.data.data;
        const { id: portId } = sender;

        this.notificationManager.notificateTimeout(errorMessage);

        callback(ERRORS.CLIENT_ERROR(errorMessage), null, [{ portId, callId }]);
        callback(null, true);
      },
    );
  }

  // Methods
  async init() {
    this.keyring.init();
    if (this.keyring.isUnlocked) {
      const state = await this.keyring?.getState();
      if (!state?.wallets?.length > 0) {
        await this.keyring.lock();
      }
    }
  }

  exposeHandlers() {
    this.init().then(() => {
      this.#hookListener();
      this.#exposeStandaloneMethods();

      BackgroundScript.#getControllerModules().forEach((Module) => {
        const moduleInstance = new Module(
          this.backgroundController,
          this.secureController.bind(this),
          this.keyring,
        );

        moduleInstance.exposeMethods();
      });
    });

    this.backgroundController.start();
  }
}

const backgroundScript = new BackgroundScript();

export default backgroundScript;
