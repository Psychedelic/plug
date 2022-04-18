import qs from 'query-string';
import extension from 'extensionizer';
import ERRORS from '@background/errors';
import {
  validateTransferArgs,
  validateTransactions,
  validateBurnArgs,
} from '@background/utils';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { ICP_CANISTER_ID } from '@shared/constants/canisters';
import { E8S_PER_ICP, CYCLES_PER_TC } from '@shared/constants/currencies';
import { XTC_FEE } from '@shared/constants/addresses';
import {
  getKeyringHandler,
  HANDLER_TYPES,
  getKeyringErrorMessage,
} from '@background/Keyring';

import SIZES from '../../Pages/Notification/components/Transfer/constants';
import {
  getApps,
  setApps,
  getApp,
  removeApp,
} from '../storageManager';

export class TransactionModule {
  constructor(backgroundController, secureController, keyring) {
    this.keyring = keyring;
    this.secureController = secureController;
    this.backgroundController = backgroundController;

    this.#DEFAULT_CURRENCY_MAP = {
      ICP: 0,
      XTC: 1,
    };
  }

  // Utils
  #getHandlerObjects() {
    return [
      this.#requestTransfer(),
      this.#handleRequestTransfer(),
      this.#requestBurnXTC(),
      this.#handleRequestBurnXTC(),
      this.#batchTransactions(),
      this.#handleBatchTransactions(),
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

  // Methods
  #requestTransfer() {
    return {
      methodName: 'requestTransfer',
      handler: async (opts, metadata, args) => {
        const { message, sender, callback } = opts;

        const { id: callId } = message.data.data;
        const { id: portId } = sender;

        getApps(this.keyring?.currentWalletId.toString(), (apps = {}) => {
          const app = apps?.[metadata?.url] || {};

          if (app?.status === CONNECTION_STATUS.accepted) {
            const argsError = validateTransferArgs(args);
            if (argsError) {
              callback(argsError, null);
              return;
            }
            const url = qs.stringifyUrl({
              url: 'notification.html',
              query: {
                callId,
                portId,
                metadataJson: JSON.stringify(metadata),
                argsJson: JSON.stringify({ ...args, timeout: app?.timeout }),
                type: 'transfer',
              },
            });

            const height = this.keyring?.isUnlocked
              ? SIZES.detailHeightSmall
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
            callback(ERRORS.CONNECTION_ERROR, null);
          }
        });
      },
    }
  }

  #handleRequestTransfer() {
    return {
      methodName: 'handleRequestTransfer',
      handler: async (opts, transferRequests, callId, portId) => {
        const { callback } = opts;
        const transfer = transferRequests?.[0];

        if (transfer?.status === 'declined') {
          callback(null, true);
          callback(ERRORS.TRANSACTION_REJECTED, null, [{ portId, callId }]);
        } else {
          const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, this.keyring);
          const sendToken = getKeyringHandler(HANDLER_TYPES.SEND_TOKEN, this.keyring);

          const assets = await getBalance();
          const parsedAmount = (transfer.amount / E8S_PER_ICP);
          if (assets?.[this.#DEFAULT_CURRENCY_MAP.ICP]?.amount > parsedAmount) {
            const response = await sendToken({
              ...transfer,
              amount: parsedAmount,
              canisterId: ICP_CANISTER_ID,
            });

            if (response.error) {
              callback(null, false);
              callback(ERRORS.SERVER_ERROR(response.error), null, [
                { portId, callId },
              ]);
            } else {
              callback(null, true);
              callback(null, response, [{ portId, callId }]);
            }
          } else {
            callback(null, false);
            callback(ERRORS.BALANCE_ERROR, null, [{ portId, callId }]);
          }
        }
      },
    }
  }

  #requestBurnXTC() {
    return {
      methodName: 'requestBurnXTC',
      handler: async (opts, metadata, args) => {
        const { message, sender, callback } = opts;

        const { id: callId } = message.data.data;
        const { id: portId } = sender;

        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[metadata.url] || {};
          if (app?.status === CONNECTION_STATUS.accepted) {
            const argsError = validateBurnArgs(args);
            if (argsError) {
              callback(argsError, null);
              return;
            }
            const url = qs.stringifyUrl({
              url: 'notification.html',
              query: {
                callId,
                portId,
                metadataJson: JSON.stringify(metadata),
                argsJson: JSON.stringify({ ...args, timeout: app?.timeout }),
                type: 'burnXTC',
              },
            });

            const height = this.keyring?.isUnlocked
              ? SIZES.detailHeightSmall
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
            callback(ERRORS.CONNECTION_ERROR, null);
          }
        });
      },
    }
  }

  #handleRequestBurnXTC() {
    return {
      methodName: 'handleRequestBurnXTC',
      handler: async (opts, transferRequests, callId, portId) => {
        const { callback } = opts;
        const transfer = transferRequests?.[0];

        // Answer this callback no matter if the transfer succeeds or not.
        if (transfer?.status === 'declined') {
          callback(null, true);
          callback(ERRORS.TRANSACTION_REJECTED, null, [{ portId, callId }]);
        } else {
          const burnXTC = getKeyringHandler(HANDLER_TYPES.BURN_XTC, this.keyring);
          const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, this.keyring);

          const assets = await getBalance();
          const xtcAmount = assets?.[this.#DEFAULT_CURRENCY_MAP.XTC]?.amount * CYCLES_PER_TC;
          const parsedAmount = transfer.amount / CYCLES_PER_TC;

          if (xtcAmount - XTC_FEE > transfer.amount) {
            const response = await burnXTC({
              ...transfer,
              amount: parsedAmount,
            });
            if (response.error) {
              callback(null, false);
              callback(ERRORS.SERVER_ERROR(response.error), null, [
                { portId, callId },
              ]);
            } else {
              const transactionId = response?.Ok;

              callback(null, true);
              callback(null, transactionId, [{ portId, callId }]);
            }
          } else {
            callback(null, false);
            callback(ERRORS.BALANCE_ERROR, null, [{ portId, callId }]);
          }
        }
      },
    }
  }

  #batchTransactions() {
    return {
      methodName: 'batchTransactions',
      handler: async (opts, metadata, transactions) => {
        const { message, sender, callback } = opts;

        const { id: callId } = message.data.data;
        const { id: portId } = sender;

        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[metadata?.url] || {};

          if (app?.status === CONNECTION_STATUS.accepted) {
            const transactionsError = validateTransactions(transactions);

            if (transactionsError) {
              callback(transactionsError, null);
              return;
            }
            const canistersInfo = app?.whitelist || {};
            const transactionsWithInfo = transactions.map((tx) => ({
              ...tx,
              canisterInfo: canistersInfo[tx.canisterId],
            }));
            const url = qs.stringifyUrl({
              url: 'notification.html',
              query: {
                callId,
                portId,
                metadataJson: JSON.stringify(metadata),
                argsJson: JSON.stringify({
                  transactions: transactionsWithInfo,
                  canistersInfo,
                  timeout: app?.timeout,
                }),
                type: 'batchTransactions',
              },
            });

            const height = this.keyring?.isUnlocked
              ? SIZES.detailHeightSmall
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
            callback(ERRORS.CONNECTION_ERROR, null);
          }
        });
      },
    }
  }

  #handleBatchTransactions() {
    return {
      methodName: 'handleBatchTransactions',
      handler: async (opts, accepted, callId, portId) => {
        const { callback } = opts;
        callback(null, true); // close the modal
        if (accepted) {
          callback(null, accepted, [{ callId, portId }]);
        } else {
          callback(ERRORS.TRANSACTION_REJECTED, false, [{ callId, portId }]);
        }
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

export default { TransactionModule };
