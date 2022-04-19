import qs from 'query-string';
import extension from 'extensionizer';
import ERRORS from '@background/errors';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { getKeyringHandler, HANDLER_TYPES } from '@background/Keyring';
import { getApps } from '../storageManager';

export class InformationModule {
  constructor(backgroundController, secureController, keyring) {
    this.keyring = keyring;
    this.secureController = secureController;
    this.backgroundController = backgroundController;
  }

  // Utils
  #getHandlerObjects() {
    return [
      this.#requestBalance(),
      this.#handleRequestBalance(),
      this.#getPublicKey(),
      this.#getPrincipal(),
      this.#handleGetPrincipal(),
    ];
  }

  #secureWrapper({ args, handlerObject }) {
    return this.secureController(
      args[0].callback,
      async () => {
        handlerObject.handler(...args);
      },
    );
  }

  async #internalRequestBalance(accountId, callback) {
    const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, this.keyring);
    const icpBalance = await getBalance(accountId);
    if (icpBalance.error) {
      callback(ERRORS.SERVER_ERROR(icpBalance.error), null);
    } else {
      callback(null, icpBalance);
    }
  };

  // Methods
  #requestBalance() {
    return {
      methodName: 'requestBalance',
      handler: async (opts, metadata, accountId) => {
        const { callback, message, sender } = opts;

        getApps(this.keyring?.currentWalletId.toString(), (apps = {}) => {
          const app = apps?.[metadata.url] || {};

          if (app?.status === CONNECTION_STATUS.accepted) {
            if (accountId && Number.isNaN(parseInt(accountId, 10))) {
              callback(ERRORS.CLIENT_ERROR('Invalid account id'), null);
            } else if (!this.keyring?.isUnlocked) {
              const url = qs.stringifyUrl({
                url: 'notification.html',
                query: {
                  callId: message.data.data.id,
                  portId: sender.id,
                  type: 'requestBalance',
                  argsJson: accountId,
                  metadataJson: JSON.stringify(metadata),
                },
              });

              extension.windows.create({
                url,
                type: 'popup',
                width: SIZES.width,
                height: SIZES.loginHeight,
              });
            } else {
              this.#internalRequestBalance(accountId, callback);
            }
          } else {
            callback(ERRORS.CONNECTION_ERROR, null);
          }
        });
      },
    }
  }

  #handleRequestBalance() {
    return {
      methodName: 'handleRequestBalance',
      handler: async (opts, url, subaccount, callId, portId) => {
        const { callback } = opts;

        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[url] || {};
          callback(null, true);

          if (app?.status === CONNECTION_STATUS.accepted) {
            const getBalance = getKeyringHandler(
              HANDLER_TYPES.GET_BALANCE,
              this.keyring,
            );
            const icpBalance = await getBalance(subaccount);

            if (icpBalance.error) {
              callback(ERRORS.SERVER_ERROR(icpBalance.error), null, [
                { portId, callId },
              ]);
            } else {
              callback(null, icpBalance, [{ portId, callId }]);
            }
          } else {
            callback(ERRORS.CONNECTION_ERROR, null, [{ portId, callId }]);
          }
        });
      },
    }
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
    }
  }

  #getPrincipal() {
    return {
      methodName: 'getPrincipal',
      handler: async (opts, pageUrl) => {
        const { callback, message, sender } = opts;

        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[pageUrl] || {};

          if (app?.status === CONNECTION_STATUS.accepted) {
            if (!this.keyring?.isUnlocked) {
              const url = qs.stringifyUrl({
                url: 'notification.html',
                query: {
                  callId: message.data.data.id,
                  portId: sender.id,
                  type: 'principal',
                  metadataJson: JSON.stringify({ url: pageUrl }),
                },
              });

              extension.windows.create({
                url,
                type: 'popup',
                width: SIZES.width,
                height: SIZES.loginHeight,
              });
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
    }
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
            const { principal } = this.keyring?.state?.wallets?.[keyring?.currentWalletId] || {};
            callback(null, principal?.toText(), [{ portId, callId }]);
          } else {
            callback(ERRORS.CONNECTION_ERROR, null, [{ portId, callId }]);
          }
        });
      },
    }
  }

  // Exposer
  exposeMethods() {
    this.#getHandlerObjects().forEach((handlerObject) => {
      this.backgroundController.exposeController(
        handlerObject.methodName,
        async (...args) => this.#secureWrapper({ args, handlerObject }),
      );
    });
  }
}

export default { InformationModule }
