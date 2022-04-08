import qs from 'query-string';
import extension from 'extensionizer';
import ERRORS from '@background/errors';
import { getKeyringHandler, HANDLER_TYPES } from '@background/Keyring';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';

import { getApp } from '../storageManager';
import SIZES from '../../Pages/Notification/components/Transfer/constants';
import ControllerModule from './controllerModule';

export class InformationModule extends ControllerModule {
  constructor(backgroundController, secureController, keyring) {
    super(backgroundController, secureController, keyring);
  }

  // Utils
  #getHandlerObjects() {
    return [
      this.#requestBalance(),
      this.#handleRequestBalance(),
    ];
  }

  async #fetchBalance(accountId, callback) {
    const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, this.keyring);
    const icpBalance = await getBalance(accountId);
    if (icpBalance.error) {
      callback(ERRORS.SERVER_ERROR(icpBalance.error), null);
    } else {
      callback(null, icpBalance);
    }
  }

  // Handlers
  #requestBalance() {
    return {
      methodName: 'requestBalance',
      handler: async (opts, metadata, accountId) => {
        const { callback, message, sender } = opts;
        const { url } = metadata;

        const currentWalletId = this.keyring?.currentWalletId?.toString();
        getApp(currentWalletId, url, (app = {}) => {
          if (app?.status !== CONNECTION_STATUS.accepted) {
            callback(ERRORS.CONNECTION_ERROR, null);
            return;
          }

          if (accountId && Number.isNaN(parseInt(accountId, 10))) {
            callback(ERRORS.CLIENT_ERROR('Invalid account id'), null);
            return;
          }

          if (!this.keyring?.isUnlocked) {
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
            return;
          }

          this.#fetchBalance(accountId, callback);
        });
      }
    }
  }

  #handleRequestBalance() {
    return {
      methodName: 'handleRequestBalance',
      handler: async (opts, url, subaccount, callId, portId) => {
        const { callback } = opts;

        const currentWalletId = this.keyring?.currentWalletId?.toString();
        getApp(currentWalletId, url, async (app = {}) => {
          callback(null, true);

          if (app?.status !== CONNECTION_STATUS.accepted) {
            callback(ERRORS.CONNECTION_ERROR, null, [{ portId, callId }]);
            return;
          }

          const getBalance = getKeyringHandler(
            HANDLER_TYPES.GET_BALANCE,
            keyring,
          );
          const icpBalance = await getBalance(subaccount);

          if (icpBalance.error) {
            callback(
              ERRORS.SERVER_ERROR(icpBalance.error),
              null,
              [
                { portId, callId },
              ]
            );
          } else {
            callback(null, icpBalance, [{ portId, callId }]);
          }
        });
      },
    }
  }

  // Exposer
  exposeMethods() {
    super.exposeMethods(this.#getHandlerObjects());
  }
}
