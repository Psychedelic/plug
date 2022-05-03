import ERRORS from '@background/errors';
import qs from 'query-string';
import extension from 'extensionizer';
import {
  validateTransferArgs,
  validateTransactions,
  validateBurnArgs,
  getToken,
} from '@background/utils';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { ICP_CANISTER_ID } from '@shared/constants/canisters';
import { E8S_PER_ICP, CYCLES_PER_TC } from '@shared/constants/currencies';
import { XTC_FEE } from '@shared/constants/addresses';
import {
  getKeyringHandler,
  HANDLER_TYPES,
} from '@background/Keyring';

import SIZES from '../../Pages/Notification/components/Transfer/constants';
import {
  getApps,
  getProtectedIds,
} from '../storageManager';
import { ControllerModuleBase } from './controllerBase';

export class TransactionModule extends ControllerModuleBase {
  constructor(backgroundController, secureController, keyring) {
    super(backgroundController, secureController, keyring);
    this.DEFAULT_CURRENCY_MAP = {
      ICP: 0,
      XTC: 1,
    };
  }

  // Utils
  #getHandlerObjects() {
    return [
      this.#requestTransfer(),
      this.#handleRequestTransfer(),
      this.#requestTransferToken(),
      this.#handleRequestTransferToken(),
      this.#requestBurnXTC(),
      this.#handleRequestBurnXTC(),
      this.#batchTransactions(),
      TransactionModule.#handleBatchTransactions(),
      this.#requestSign(),
      this.#handleSign(),
    ];
  }

  async #signData(payload, callback) {
    const parsedPayload = new Uint8Array(Object.values(payload));
    const signed = await this.keyring?.sign(parsedPayload.buffer);
    callback(null, [...new Uint8Array(signed)]);
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

            const height = this.keyring?.isUnlocked
              ? SIZES.detailHeightSmall
              : SIZES.loginHeight;

            this.displayPopUp({
              callId,
              portId,
              metadataJson: JSON.stringify(metadata),
              argsJson: JSON.stringify({ ...args, timeout: app?.timeout }),
              type: 'transfer',
              screenArgs: {
                fixedHeight: height,
                top: 65,
                left: metadata.pageWidth - SIZES.width,
              },
            });
          } else {
            callback(ERRORS.CONNECTION_ERROR, null);
          }
        });
      },
    };
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
          if (assets?.[this.DEFAULT_CURRENCY_MAP.ICP]?.amount > parsedAmount) {
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
    };
  }

  #requestTransferToken() {
    return {
      methodName: 'requestTransferToken',
      handler: async (opts, metadata, args) => {
        const { message, sender, callback } = opts;

        const { id: callId } = message.data.data;
        const { id: portId } = sender;

        getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
          const app = apps?.[metadata?.url] || {};

          if (app?.status === CONNECTION_STATUS.accepted) {
            const argsError = validateTransferArgs(args);
            if (argsError) {
              callback(argsError, null);
              return;
            }

            const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, this.keyring);
            const assets = await getBalance();

            const token = getToken(args.token, assets);

            if (!token) {
              callback(ERRORS.CONNECTION_ERROR, null, [{ portId, callId }]);
            }

            const url = qs.stringifyUrl({
              url: 'notification.html',
              query: {
                callId,
                portId,
                metadataJson: JSON.stringify(metadata),
                argsJson: JSON.stringify({ ...args, token, timeout: app?.timeout }),
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
    };
  }

  #handleRequestTransferToken() {
    return {
      methodName: 'handleRequestTransferToken',
      handler: async (opts, transferRequests, callId, portId) => {
        const { callback } = opts;
        const transfer = transferRequests?.[0];
        const amount = parseFloat(transfer.strAmount);

        if (transfer?.status === 'declined') {
          callback(null, true);
          callback(ERRORS.TRANSACTION_REJECTED, null, [{ portId, callId }]);
        } else {
          const sendToken = getKeyringHandler(HANDLER_TYPES.SEND_TOKEN, this.keyring);

          if (transfer.token.amount > amount) {
            const response = await sendToken({
              ...transfer,
              amount,
              canisterId: transfer.token.canisterId,
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
    };
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
            const height = this.keyring?.isUnlocked
              ? SIZES.detailHeightSmall
              : SIZES.loginHeight;

            this.displayPopUp({
              callId,
              portId,
              metadataJson: JSON.stringify(metadata),
              argsJson: JSON.stringify({ ...args, timeout: app?.timeout }),
              type: 'burnXTC',
              screenArgs: {
                fixedHeight: height,
                top: 65,
                left: metadata.pageWidth - SIZES.width,
              },
            });
          } else {
            callback(ERRORS.CONNECTION_ERROR, null);
          }
        });
      },
    };
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
          const xtcAmount = assets?.[this.DEFAULT_CURRENCY_MAP.XTC]?.amount * CYCLES_PER_TC;
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
    };
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
            const height = this.keyring?.isUnlocked
              ? SIZES.detailHeightSmall
              : SIZES.loginHeight;

            this.displayPopUp({
              callId,
              portId,
              metadataJson: JSON.stringify(metadata),
              argsJson: JSON.stringify({
                transactions: transactionsWithInfo,
                canistersInfo,
                timeout: app?.timeout,
              }),
              type: 'batchTransactions',
              screenArgs: {
                fixedHeight: height,
                top: 65,
                left: metadata.pageWidth - SIZES.width,
              },
            });
          } else {
            callback(ERRORS.CONNECTION_ERROR, null);
          }
        });
      },
    };
  }

  static #handleBatchTransactions() {
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
    };
  }

  #requestSign() {
    return {
      methodName: 'requestSign',
      handler: async (opts, payload, metadata, requestInfo) => {
        const { message, sender, callback } = opts;
        const { id: callId } = message.data.data;
        const { id: portId } = sender;
        const { canisterId, requestType, preApprove } = requestInfo;

        try {
          const isDangerousUpdateCall = !preApprove && requestType === 'call';
          if (isDangerousUpdateCall) {
            getApps(this.keyring?.currentWalletId.toString(), async (apps = {}) => {
              const app = apps?.[metadata.url] || {};
              if (app.status !== CONNECTION_STATUS.accepted) {
                callback(ERRORS.CONNECTION_ERROR, null);
                return;
              }
              if (canisterId && !(canisterId in app.whitelist)) {
                callback(ERRORS.CANISTER_NOT_WHITLESTED_ERROR(canisterId), null);
                return;
              }
              getProtectedIds(async (protectedIds) => {
                const canisterInfo = app.whitelist[canisterId];
                const shouldShowModal = protectedIds.includes(canisterInfo.id);

                if (shouldShowModal) {
                  const height = this.keyring?.isUnlocked
                    ? SIZES.appConnectHeight
                    : SIZES.loginHeight;

                  this.displayPopUp({
                    callId,
                    portId,
                    type: 'sign',
                    metadataJson: JSON.stringify(metadata),
                    argsJson: JSON.stringify({
                      requestInfo,
                      payload,
                      canisterInfo,
                      timeout: app?.timeout,
                    }),
                    screenArgs: {
                      fixedHeight: height,
                    },
                  });
                } else {
                  this.#signData(payload, callback);
                }
              });
            });
          } else {
            this.#signData(payload, callback);
          }
        } catch (e) {
          callback(ERRORS.SERVER_ERROR(e), null);
        }
      },
    };
  }

  #handleSign() {
    return {
      methodName: 'handleSign',
      handler: async (opts, status, payload, callId, portId) => {
        const { callback } = opts;

        if (status === CONNECTION_STATUS.accepted) {
          try {
            const parsedPayload = new Uint8Array(Object.values(payload));

            const signed = await this.keyring?.sign(parsedPayload.buffer);
            callback(null, new Uint8Array(signed), [{ callId, portId }]);
            callback(null, true);
          } catch (e) {
            callback(ERRORS.SERVER_ERROR(e), null, [{ portId, callId }]);
            callback(null, false);
          }
        } else {
          callback(ERRORS.SIGN_REJECTED, null, [{ portId, callId }]);
          callback(null, true); // Return true to close the modal
        }
      },
    };
  }

  // Exposer
  exposeMethods() {
    this.#getHandlerObjects().forEach((handlerObject) => {
      this.backgroundController.exposeController(
        handlerObject.methodName,
        async (...args) => this.secureWrapper({ args, handlerObject }),
      );
    });
  }
}

export default { TransactionModule };
