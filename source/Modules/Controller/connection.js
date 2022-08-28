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
import SIZES from '../../views/Popup/components/Transfer/constants';

import { ControllerModuleBase } from './controllerBase';

export class ConnectionModule extends ControllerModuleBase {
  // Utils
  #getSafeHandlerObjects() {
    return [
      this.#disconnect(),
    ];
  }

  #getHandlerObjects() {
    return [
      this.#verifyWhitelist(),
      this.#getConnectionData(),
      this.#requestConnect(),
    ];
  }

  #getExecutorObjects() {
    return [
      this.#handleConnectionData(),
      this.#handleAllowAgent(),
    ];
  }

  // Handlers
  #getConnectionData() {
    return {
      methodName: 'getConnectionData',
      handler: async (opts, url, transactionId) => {
        const { message, sender, callback } = opts;
        const { id: callId } = message.data.data;
        const { id: portId } = sender;
        initializeProtectedIds();
        const walletId = this.keyring?.currentWalletId;
        getApp(walletId.toString(), url, async (app = {}) => {
          if (app?.status === CONNECTION_STATUS.accepted) {
            if (!this.keyring?.isUnlocked) {
              this.displayPopUp({
                callId,
                portId,
                argsJson: JSON.stringify({ transactionId }),
                metadataJson: JSON.stringify({ url }),
                type: 'requestConnectionData',
                screenArgs: { fixedHeight: SIZES.loginHeight },
              }, callback);
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
      handler: async (opts, metadata, whitelist, timeout, host, transactionId) => {
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

        const populatedWhitelist = canistersInfo.reduce(
          (accum, canisterInfo) => ({ ...accum, [canisterInfo.id]: canisterInfo }),
          {},
        );

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
              whitelist: populatedWhitelist,
              host,
            },
          };
          setApps(this.keyring?.currentWalletId.toString(), newApps);
        });

        // if we receive a whitelist, we create agent
        if (isValidWhitelist) {
          const newMetadata = { ...metadata, requestConnect: true };

          const height = this.keyring?.isUnlocked
            ? Math.min(422 + 37 * whitelist.length, 600)
            : SIZES.loginHeight;

          this.displayPopUp(
            {
              callId,
              portId,
              argsJson: JSON.stringify({
                whitelist, canistersInfo, timeout, transactionId,
              }),
              metadataJson: JSON.stringify(newMetadata),
              domainUrl,
              type: 'allowAgent',
              screenArgs: {
                fixedHeight: height,
                top: 65,
                left: metadata.pageWidth - SIZES.width,
              },
            },
            opts.callback,
          );
        } else {
          const height = this.keyring?.isUnlocked
            ? SIZES.appConnectHeight
            : SIZES.loginHeight;

          this.displayPopUp({
            callId,
            portId,
            icon: icons[0] || null,
            argsJson: JSON.stringify({ timeout, transactionId }),
            type: 'connect',
            screenArgs: {
              fixedHeight: height,
            },
            domainUrl,
          }, opts.callback);
        }
      },
    };
  }

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
            ? apps[url]?.whitelist
            : [];

          const date = new Date().toISOString();

          const newApps = {
            ...apps,
            [url]: {
              ...apps[url],
              status: status || CONNECTION_STATUS.rejected,
              date,
              whitelist: { ...apps[url]?.whitelist, ...whitelist },
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
    };
  }

  #verifyWhitelist() {
    return {
      methodName: 'verifyWhitelist',
      handler: async (opts, metadata, whitelist, transactionId) => {
        const { message, sender, callback } = opts;

        const { id: callId } = message.data.data;
        const { id: portId } = sender;
        const { url: domainUrl, name, icons } = metadata;

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
                this.displayPopUp({
                  callId,
                  portId,
                  metadataJson: JSON.stringify(metadata),
                  argsJson: JSON.stringify({
                    whitelist,
                    canistersInfo,
                    updateWhitelist: true,
                    showList: false,
                    timeout: app?.timeout,
                    transactionId,
                  }),
                  domainUrl: metadata.url,
                  type: 'allowAgent',
                  screenArgs: {
                    fixedHeight: height,
                    top: 65,
                    left: metadata.pageWidth - SIZES.width,
                  },
                }, callback);
              }
              const publicKey = await this.keyring?.getPublicKey();
              callback(null, publicKey);
            } else {
              this.displayPopUp({
                callId,
                portId,
                metadataJson: JSON.stringify(metadata),
                domainUrl: metadata.url,
                argsJson: JSON.stringify({
                  whitelist,
                  canistersInfo,
                  updateWhitelist: true,
                  showList: true,
                  transactionId,
                }),
                type: 'allowAgent',
                screenArgs: {
                  fixedHeight: height,
                  top: 65,
                  left: metadata.pageWidth - SIZES.width,
                },
              }, callback);
            }
          } else {
            callback(ERRORS.CONNECTION_ERROR, null);
          }

          const populatedWhitelist = canistersInfo.reduce(
            (accum, canisterInfo) => ({ ...accum, [canisterInfo.id]: canisterInfo }),
            {},
          );
          const newApps = {
            ...apps,
            [domainUrl]: {
              url: domainUrl,
              name,
              status: CONNECTION_STATUS.pending,
              icon: icons[0] || null,
              date: new Date().toISOString(),
              events: [
                ...apps[domainUrl]?.events || [],
              ],
              whitelist: populatedWhitelist,
            },
          };
          setApps(this.keyring?.currentWalletId.toString(), newApps);
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

export default { ConnectionModule };
