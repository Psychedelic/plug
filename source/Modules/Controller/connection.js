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
      handler: async (opts, url, principal) => {
        const state = await this.keyring.getState();

        const walletIdFromPrincipal = Object.values(state.wallets).find((wallet) => (
          wallet.principal === principal
        ))?.walletId;
        const walletIdToRemove = walletIdFromPrincipal ?? this.keyring.currentWalletId;

        removeApp(walletIdToRemove, url, (removed) => {
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
        const { message, sender, callback } = opts;
        const { id: callId } = message.data.data;
        const { id: portId } = sender;
        const { url: domainUrl, icons } = metadata;
        const newMetadata = { ...metadata, host };

        if (isValidWhitelist) {
          canistersInfo = await fetchCanistersInfo(whitelist);
        }

        // Generate a whitelist object from the canister Info
        const populatedWhitelist = canistersInfo.reduce(
          (accum, canisterInfo) => ({ ...accum, [canisterInfo.id]: canisterInfo }),
          {},
        );

        // If we receive a whitelist, we open the allow agent modal
        if (isValidWhitelist) {
          const fixedHeight = this.keyring?.isUnlocked
            ? Math.min(422 + 65 * whitelist.length, 550)
            : SIZES.loginHeight;

          this.displayPopUp(
            {
              callId,
              portId,
              argsJson: JSON.stringify({
                whitelist: populatedWhitelist, canistersInfo, timeout, transactionId,
              }),
              metadataJson: JSON.stringify(newMetadata),
              domainUrl,
              type: 'allowAgent',
              screenArgs: {
                fixedHeight,
                top: 65,
                left: metadata.pageWidth - SIZES.width,
              },
            },
            callback,
          );
        } else {
          // Else it's a plain connection request one
          this.displayPopUp({
            callId,
            portId,
            icon: icons[0] || null,
            argsJson: JSON.stringify({ timeout, transactionId }),
            type: 'connect',
            domainUrl,
            metadataJson: JSON.stringify(newMetadata),
          }, callback);
        }
      },
    };
  }

  #handleAllowAgent() {
    return {
      methodName: 'handleAllowAgent',
      handler: async (opts, url, response, callId, portId) => {
        const { callback } = opts;
        const { status = CONNECTION_STATUS.rejected, whitelist = {} } = response || {};
        if (status === CONNECTION_STATUS.accepted) {
          // If connection request was accepted
          // we update the storage entry then return the public key

          // Update the storage with this new app, keep old whitelist records and add new ones
          getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
            const date = new Date().toISOString();
            const app = apps[url] || {};
            const appWhitelist = app?.status === CONNECTION_STATUS.accepted ? app.whitelist : {};
            const { name, host, icons } = response?.metadata || {};
            const newApps = {
              ...apps,
              [url]: {
                ...app,
                url,
                name,
                host,
                icon: icons?.[0] || '',
                status,
                date,
                whitelist: { ...appWhitelist, ...whitelist },
                events: [
                  ...app?.events?.slice(-20) || [], // Keep only last 20 events
                  {
                    status,
                    date,
                  },
                ],
              },
            };
            setApps(this.keyring?.currentWalletId.toString(), newApps);
          });
          try {
            const publicKey = await this.keyring?.getPublicKey();
            callback(null, publicKey, [{ portId, callId }]);
            callback(null, true);
          } catch (e) {
            callback(ERRORS.SERVER_ERROR(e), null, [{ portId, callId }]);
            callback(null, false);
          }
        } else {
          // If the call was not accepted, then we do nothing to storage
          // since previously accepted apps are still there and a disconnect
          // entry would be added in `disconnect` method
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

        let canistersInfo = [];

        // Validate whiltelist and if valid, get canisters Info
        const isValidWhitelist = Array.isArray(whitelist) && whitelist.length;
        if (isValidWhitelist) {
          canistersInfo = await fetchCanistersInfo(whitelist);
        }
        if (!whitelist?.every((canisterId) => validatePrincipalId(canisterId))) {
          callback(ERRORS.CANISTER_ID_ERROR, null);
          return;
        }

        // Get saved app and check if all of the entries received are there
        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[metadata.url] || {};
          if (app?.status === CONNECTION_STATUS.accepted) {
            const allWhitelisted = areAllElementsIn(
              whitelist,
              app?.whitelist ? Object.keys(app?.whitelist) : [],
            );
            const fixedHeight = this.keyring?.isUnlocked
              ? SIZES.detailHeightSmall
              : SIZES.loginHeight;
            const populatedWhitelist = canistersInfo.reduce(
              (accum, canisterInfo) => ({ ...accum, [canisterInfo.id]: canisterInfo }),
              {},
            );
            if (allWhitelisted) {
              // If keyring is unlocked then we return the public key
              if (this.keyring.isUnlocked) {
                const publicKey = await this.keyring?.getPublicKey();
                callback(null, publicKey);
              } else {
                // If locked we need to display the unlock modal
                this.displayPopUp({
                  callId,
                  portId,
                  metadataJson: JSON.stringify(metadata),
                  argsJson: JSON.stringify({
                    whitelist: populatedWhitelist,
                    canistersInfo,
                    timeout: app?.timeout,
                    transactionId,
                  }),
                  domainUrl: metadata.url,
                  type: 'allowAgent',
                  screenArgs: {
                    fixedHeight,
                    top: 65,
                    left: metadata.pageWidth - SIZES.width,
                  },
                }, callback);
              }
            } else {
              // If they are not all whitelisted, we need to show the allow agent modal
              this.displayPopUp({
                callId,
                portId,
                metadataJson: JSON.stringify(metadata),
                domainUrl: metadata.url,
                argsJson: JSON.stringify({
                  whitelist: populatedWhitelist,
                  canistersInfo,
                  transactionId,
                }),
                type: 'allowAgent',
                screenArgs: {
                  fixedHeight,
                  top: 65,
                  left: metadata.pageWidth - SIZES.width,
                },
              }, callback);
            }
          } else {
            callback(ERRORS.CONNECTION_ERROR, null);
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

export default { ConnectionModule };
