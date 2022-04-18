import qs from 'query-string';
import extension from 'extensionizer';
import ERRORS from '@background/errors';
import { validatePrincipalId } from '@shared/utils/ids';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { areAllElementsIn } from '@shared/utils/array';
import { fetchCanistersInfo, initializeProtectedIds } from '@background/utils';
import {
  getApps,
  setApps,
  getApp,
  removeApp,
} from '../storageManager';
import SIZES from '../../Pages/Notification/components/Transfer/constants';

export class ConnectionModule {
  constructor(backgroundController, secureController, keyring) {
    this.keyring = keyring;
    this.secureController = secureController;
    this.backgroundController = backgroundController;
  }

  // Utils
  #getHandlerObjects() {
    return [
      this.#getConnectionData(),
      this.#handleConnectionData(),
      this.#disconnect(),
      this.#requestConnect(),
      this.#handleAllowAgent(),
      this.#verifyWhitelist(),
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

  // Handlers
  #getConnectionData() {
    return {
      methodName: 'getConnectionData',
      handler: async (opts, url) => {
        const { message, sender, callback } = opts;
        const { id: callId } = message.data.data;
        const { id: portId } = sender;
        initializeProtectedIds();
        const walletId = this.keyring?.currentWalletId;
        getApp(walletId.toString(), url, async (app = {}) => {
          if (app?.status === CONNECTION_STATUS.accepted) {
            if (!this.keyring?.isUnlocked) {
              const modalUrl = qs.stringifyUrl({
                url: 'notification.html',
                query: {
                  callId,
                  portId,
                  type: 'requestConnectionData',
                  argsJson: '{}',
                  metadataJson: JSON.stringify({ url }),
                },
              });

              extension.windows.create({
                url: modalUrl,
                type: 'popup',
                width: SIZES.width,
                height: SIZES.loginHeight,
              });
            } else {
              const publicKey = await this.keyring?.getPublicKey(walletId);
              const { host, timeout, whitelist } = app;
              callback(null, {
                host, whitelist: Object.keys(whitelist), timeout, publicKey,
              });
            }
          } else {
            callback(null, null);
          }
        });
      },
    };
  }

  #handleConnectionData() {
    return {
      methodName: 'handleRequestConnectionData',
      handler: async (opts, url, _, callId, portId) => {
        const { callback } = opts;
        const walletId = this.keyring?.currentWalletId;

        getApp(walletId.toString(), url, async (app = {}) => {
          callback(null, true);
          if (app?.status === CONNECTION_STATUS.accepted) {
            await this.keyring?.getState();
            const publicKey = await this.keyring?.getPublicKey(walletId);
            const { host, timeout, whitelist } = app;
            callback(null, {
              host, whitelist: Object.keys(whitelist), timeout, publicKey,
            }, [{ portId, callId }]);
          } else {
            callback(ERRORS.CONNECTION_ERROR, null, [{ portId, callId }]);
          }
        });
      },
    };
  }

  #disconnect() {
    return {
      methodName: 'disconnect',
      handler: async (opts, url) => {
        removeApp(this.keyring?.currentWalletId?.toString(), url, (removed) => {
          if (!removed) {
            opts.callback(ERRORS.CONNECTION_ERROR, null);
          }
        });
      },
    };
  }

  #requestConnect() {
    return {
      methodName: 'requestConnect',
      handler: async (opts, metadata, whitelist, timeout) => {
        let canistersInfo = [];
        initializeProtectedIds();
        const isValidWhitelist = Array.isArray(whitelist) && whitelist.length;
        if (!whitelist.every((canisterId) => validatePrincipalId(canisterId))) {
          opts.callback(ERRORS.CANISTER_ID_ERROR, null);
          return;
        }
        const { message, sender } = opts;
        const { id: callId } = message.data.data;
        const { id: portId } = sender;
        const { url: domainUrl, name, icons } = metadata;

        if (isValidWhitelist) {
          canistersInfo = await fetchCanistersInfo(whitelist);
        }

        const date = new Date().toISOString();

        getApps(this.keyring?.currentWalletId.toString(), (apps = {}) => {
          const newApps = {
            ...apps,
            [domainUrl]: {
              url: domainUrl,
              name,
              status: CONNECTION_STATUS.pending,
              icon: icons[0] || null,
              timeout,
              date,
              events: [
                ...apps[domainUrl]?.events || [],
              ],
              whitelist,
            },
          };
          setApps(this.keyring?.currentWalletId.toString(), newApps);
        });

        // if we receive a whitelist, we create agent
        if (isValidWhitelist) {
          const newMetadata = { ...metadata, requestConnect: true };

          const url = qs.stringifyUrl({
            url: 'notification.html',
            query: {
              callId,
              portId,
              metadataJson: JSON.stringify(newMetadata),
              argsJson: JSON.stringify({ whitelist, canistersInfo, timeout }),
              type: 'allowAgent',
            },
          });

          const height = this.keyring?.isUnlocked
            ? Math.min(422 + 37 * whitelist.length, 600)
            : SIZES.loginHeight;

          extension.windows.create({
            url,
            type: 'popup',
            width: SIZES.width,
            height,
            top: 65,
            left: metadata.pageWidth - SIZES.width,
          });
        } else {
          const url = qs.stringifyUrl({
            url: 'notification.html',
            query: {
              callId,
              portId,
              url: domainUrl,
              icon: icons[0] || null,
              argsJson: JSON.stringify({ timeout }),
              type: 'connect',
            },
          });

          const height = this.keyring?.isUnlocked
            ? SIZES.appConnectHeight
            : SIZES.loginHeight;

          extension.windows.create({
            url,
            type: 'popup',
            width: SIZES.width,
            height,
          });
        }
      },
    };
  }

  // Check SecureController
  #handleAllowAgent() {
    return {
      methodName: 'handleAllowAgent',
      handler: async (opts, url, response, callId, portId) => {
        const { callback } = opts;

        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const status = response.status === CONNECTION_STATUS.rejectedAgent
            ? CONNECTION_STATUS.accepted
            : response.status;
          const whitelist = response.status === CONNECTION_STATUS.accepted
            ? response.whitelist
            : [];

          const date = new Date().toISOString();

          const newApps = {
            ...apps,
            [url]: {
              ...apps[url],
              status: status || CONNECTION_STATUS.rejected,
              date,
              whitelist,
              events: [
                ...apps[url]?.events || [],
                {
                  status: status || CONNECTION_STATUS.rejected,
                  date,
                },
              ],
            },
          };
          setApps(this.keyring?.currentWalletId.toString(), newApps);
        });

        if (response?.status === CONNECTION_STATUS.accepted) {
          try {
            const publicKey = await this.keyring?.getPublicKey();
            callback(null, publicKey, [{ portId, callId }]);
            callback(null, true);
          } catch (e) {
            callback(ERRORS.SERVER_ERROR(e), null, [{ portId, callId }]);
            callback(null, false);
          }
        } else {
          callback(ERRORS.AGENT_REJECTED, null, [{ portId, callId }]);
          callback(null, true); // Return true to close the modal
        }
      },
    }
  }

  // Check SecureController
  #verifyWhitelist() {
    return {
      methodName: 'verifyWhitelist',
      handler: async (opts, metadata, whitelist) => {
        const { message, sender, callback } = opts;

        const { id: callId } = message.data.data;
        const { id: portId } = sender;

        let canistersInfo = [];

        const isValidWhitelist = Array.isArray(whitelist) && whitelist.length;

        if (isValidWhitelist) {
          canistersInfo = await fetchCanistersInfo(whitelist);
        }
        if (!whitelist.every((canisterId) => validatePrincipalId(canisterId))) {
          callback(ERRORS.CANISTER_ID_ERROR, null);
          return;
        }

        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[metadata.url] || {};
          if (app?.status === CONNECTION_STATUS.accepted) {
            const allWhitelisted = areAllElementsIn(
              whitelist,
              app?.whitelist ? Object.keys(app?.whitelist) : [],
            );
            const height = this.keyring?.isUnlocked
              ? SIZES.detailHeightSmall
              : SIZES.loginHeight;

            if (allWhitelisted) {
              if (!this.keyring.isUnlocked) {
                const url = qs.stringifyUrl({
                  url: 'notification.html',
                  query: {
                    callId,
                    portId,
                    metadataJson: JSON.stringify(metadata),
                    argsJson: JSON.stringify({
                      whitelist,
                      canistersInfo,
                      updateWhitelist: true,
                      showList: false,
                      timeout: app?.timeout,
                    }),
                    type: 'allowAgent',
                  },
                });
                extension.windows.create({
                  url,
                  type: 'popup',
                  width: SIZES.width,
                  height,
                  top: 65,
                  left: metadata.pageWidth - SIZES.width,
                });
              }
              const publicKey = await this.keyring?.getPublicKey();
              callback(null, publicKey);
            } else {
              const url = qs.stringifyUrl({
                url: 'notification.html',
                query: {
                  callId,
                  portId,
                  metadataJson: JSON.stringify(metadata),
                  argsJson: JSON.stringify({
                    whitelist,
                    canistersInfo,
                    updateWhitelist: true,
                    showList: true,
                  }),
                  type: 'allowAgent',
                },
              });

              extension.windows.create({
                url,
                type: 'popup',
                width: SIZES.width,
                height,
                top: 65,
                left: metadata.pageWidth - SIZES.width,
              });
            }
          } else {
            callback(ERRORS.CONNECTION_ERROR, null);
          }
        },
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

export default { ConnectionModule };
