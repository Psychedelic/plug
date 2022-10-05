import ERRORS from '@background/errors';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { getKeyringHandler, HANDLER_TYPES } from '@background/Keyring';
import { getApps } from '../storageManager';
import { ControllerModuleBase } from './controllerBase';

export class InformationModule extends ControllerModuleBase {
  // Utils
  #getSafeHandlerObjects() {
    return [
      this.#getPublicKey(),
    ];
  }

  #getHandlerObjects() {
    return [
      this.#requestBalance(),
      this.#getPrincipal(),
      this.#getICNSInfo(),
    ];
  }

  #getExecutorObjects() {
    return [
      this.#handleRequestBalance(),
      this.#handleGetPrincipal(),
      this.#handleGetICNSInfo(),
    ];
  }

  async #internalRequestBalance(subaccount, callback, portConfig) {
    const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, this.keyring);
    const balances = await getBalance(subaccount);
    if (balances?.error) {
      callback(ERRORS.GET_BALANCE_ERROR, null, portConfig);
    } else {
      callback(null, balances, portConfig);
    }
  }

  // Methods
  #requestBalance() {
    return {
      methodName: 'requestBalance',
      handler: async (opts, metadata, subaccount, transactionId) => {
        const { callback, message, sender } = opts;
        getApps(this.keyring?.currentWalletId.toString(), (apps = {}) => {
          const app = apps?.[metadata.url] || {};
          if (app?.status === CONNECTION_STATUS.accepted) {
            if (!this.keyring?.isUnlocked) {
              this.displayPopUp({
                callId: message.data.data.id,
                portId: sender.id,
                type: 'requestBalance',
                argsJson: JSON.stringify({ subaccount, transactionId }),
                metadataJson: JSON.stringify(metadata),
              }, callback);
            } else {
              this.#internalRequestBalance(subaccount, callback);
            }
          } else {
            callback(ERRORS.CONNECTION_ERROR, null);
          }
        });
      },
    };
  }

  #handleRequestBalance() {
    return {
      methodName: 'handleRequestBalance',
      handler: async (opts, url, args, callId, portId) => {
        const { callback } = opts;
        const { subaccount } = args;
        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[url] || {};
          callback(null, true); // Close modal
          if (app?.status === CONNECTION_STATUS.accepted) {
            this.#internalRequestBalance(subaccount, callback, [{ portId, callId }]);
          } else {
            callback(ERRORS.CONNECTION_ERROR, null, [{ portId, callId }]);
          }
        });
      },
    };
  }

  #getPublicKey() {
    return {
      methodName: 'getPublicKey',
      handler: async (opts) => {
        const { callback } = opts;
        try {
          const publicKey = await this.keyring?.getPublicKey();
          callback(null, publicKey);
        } catch (e) {
          callback(ERRORS.SERVER_ERROR(e), null);
        }
      },
    };
  }

  #getPrincipal() {
    return {
      methodName: 'getPrincipal',
      handler: async (opts, pageUrl, transactionId) => {
        const { callback, message, sender } = opts;

        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[pageUrl] || {};

          if (app?.status === CONNECTION_STATUS.accepted) {
            if (!this.keyring?.isUnlocked) {
              this.displayPopUp({
                url: 'notification.html',
                callId: message.data.data.id,
                portId: sender.id,
                type: 'principal',
                metadataJson: JSON.stringify({ url: pageUrl }),
                argsJson: JSON.stringify({ transactionId }),
              }, callback);
            } else {
              callback(
                null,
                this.keyring?.state.wallets[this.keyring?.currentWalletId].principal,
              );
            }
          } else {
            callback(ERRORS.CONNECTION_ERROR, null);
          }
        });
      },
    };
  }

  #handleGetPrincipal() {
    return {
      methodName: 'handleGetPrincipal',
      handler: async (opts, url, callId, portId) => {
        const { callback } = opts;

        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[url] || {};
          callback(null, true);
          if (app?.status === CONNECTION_STATUS.accepted) {
            const { principal } = this.keyring?.state?.wallets?.
              [this.keyring?.currentWalletId] || {};
            callback(null, principal?.toText(), [{ portId, callId }]);
          } else {
            callback(ERRORS.CONNECTION_ERROR, null, [{ portId, callId }]);
          }
        });
      },
    };
  }

  #getICNSInfo() {
    return {
      methodName: 'getICNSInfo',
      handler: async (opts, metadata, transactionId) => {
        const { callback, message, sender } = opts;

        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[metadata.url] || {};

          if (app?.status === CONNECTION_STATUS.accepted) {
            if (!this.keyring?.isUnlocked) {
              this.displayPopUp({
                callId: message.data.data.id,
                portId: sender.id,
                type: 'getICNSInfo',
                argsJson: JSON.stringify({ transactionId }),
                metadataJson: JSON.stringify(metadata),
              }, callback);
            } else {
              try {
                const getICNSData = getKeyringHandler(HANDLER_TYPES.GET_ICNS_DATA, this.keyring);
                const icnsData = await getICNSData({ refresh: true });
                callback(null, icnsData);
              } catch (e) {
                callback(null, { names: [] });
              }
            }
          } else {
            callback(ERRORS.CONNECTION_ERROR, null);
          }
        });
      },
    };
  }

  #handleGetICNSInfo() {
    return {
      methodName: 'handleGetICNSInfo',
      handler: async (opts, url, _, callId, portId) => {
        const { callback } = opts;

        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[url] || {};
          callback(null, true);

          if (app?.status === CONNECTION_STATUS.accepted) {
            try {
              const getICNSData = getKeyringHandler(HANDLER_TYPES.GET_ICNS_DATA, this.keyring);
              const icnsData = await getICNSData({ refresh: true });
              callback(null, icnsData, [{ portId, callId }]);
            } catch (e) {
              callback(null, { names: [] }, [{ portId, callId }]);
            }
          } else {
            callback(ERRORS.CONNECTION_ERROR, null, [{ portId, callId }]);
          }
        });
      },
    };
  }

  // Exposer
  exposeMethods() {
    this.#getSafeHandlerObjects().forEach((handlerObject) => {
      this.backgroundController.exposeController(
        handlerObject.methodName,
        async (...args) => this.secureWrapper({ args, handlerObject }),
      );
    });
    this.#getHandlerObjects().forEach((handlerObject) => {
      this.backgroundController.exposeController(
        handlerObject.methodName,
        async (...args) => this.secureHandler({ args, handlerObject }),
      );
    });
    this.#getExecutorObjects().forEach((handlerObject) => {
      this.backgroundController.exposeController(
        handlerObject.methodName,
        async (...args) => this.secureExecutor({ args, handlerObject }),
      );
    });
  }
}

export default { InformationModule };
