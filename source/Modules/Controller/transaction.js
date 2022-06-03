import ERRORS from '@background/errors';
import qs from 'query-string';
import extension from 'extensionizer';
import {
  validateTransferArgs,
  validateTransactions,
  validateBurnArgs,
  getToken,
  base64ToBuffer,
  bufferToBase64,
  handleCallRequest,
  generateRequestInfo,
} from '@background/utils';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { ICP_CANISTER_ID } from '@shared/constants/canisters';
import { E8S_PER_ICP, CYCLES_PER_TC } from '@shared/constants/currencies';
import { XTC_FEE } from '@shared/constants/addresses';
import { getKeyringHandler, HANDLER_TYPES } from '@background/Keyring';
import { blobFromBuffer, blobToUint8Array } from '@dfinity/candid';

import SIZES from '../../Pages/Notification/components/Transfer/constants';
import {
  getBatchTransactions, getProtectedIds, setBatchTransactions, getApp,
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
  #getSafeHandlerObjects() {
    return [
      this.#requestReadState(),
      this.#requestQuery(),
    ];
  }

  #getHandlerObjects() {
    return [
      this.#requestTransfer(),
      this.#requestTransferToken(),
      this.#requestBurnXTC(),
      this.#batchTransactions(),
      this.#requestCall(),
    ];
  }

  #getExecutorObjects() {
    return [
      this.#handleRequestTransfer(),
      this.#handleRequestTransferToken(),
      this.#handleRequestBurnXTC(),
      TransactionModule.#handleBatchTransactions(),
      this.#handleCall(),
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
      handler: async (opts, metadata, args, transactionId) => {
        const { message, sender, callback } = opts;

        const { id: callId } = message.data.data;
        const { id: portId } = sender;

        getApp(this.keyring?.currentWalletId.toString(), metadata.url, (app) => {
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
              argsJson: JSON.stringify({ ...args, timeout: app?.timeout, transactionId }),
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
        console.log('ok Im here');
        const transfer = transferRequests?.[0];
        if (transfer?.status === 'declined') {
          callback(ERRORS.TRANSACTION_REJECTED, null, [{ portId, callId }]);
          callback(null, true);
        } else {
          const getBalance = getKeyringHandler(
            HANDLER_TYPES.GET_BALANCE,
            this.keyring,
          );
          const sendToken = getKeyringHandler(
            HANDLER_TYPES.SEND_TOKEN,
            this.keyring,
          );

          const assets = await getBalance();
          const parsedAmount = transfer.amount / E8S_PER_ICP;
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
      handler: async (opts, metadata, args, transactionId) => {
        const { message, sender, callback } = opts;

        const { id: callId } = message.data.data;
        const { id: portId } = sender;

        getApp(this.keyring?.currentWalletId.toString(), metadata.url, async (app = {}) => {
          if (app?.status === CONNECTION_STATUS.accepted) {
            const argsError = validateTransferArgs(args);
            if (argsError) {
              callback(argsError, null);
              return;
            }

            const getBalance = getKeyringHandler(
              HANDLER_TYPES.GET_BALANCE,
              this.keyring,
            );
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
                argsJson: JSON.stringify({
                  ...args,
                  transactionId,
                  token,
                  timeout: app?.timeout,
                }),
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
          const sendToken = getKeyringHandler(
            HANDLER_TYPES.SEND_TOKEN,
            this.keyring,
          );

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
      handler: async (opts, metadata, args, transactionId) => {
        const { message, sender, callback } = opts;

        const { id: callId } = message.data.data;
        const { id: portId } = sender;

        getApp(this.keyring?.currentWalletId.toString(), metadata.url, async (app = {}) => {
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
              argsJson: JSON.stringify({ ...args, timeout: app?.timeout, transactionId }),
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
          const burnXTC = getKeyringHandler(
            HANDLER_TYPES.BURN_XTC,
            this.keyring,
          );
          const getBalance = getKeyringHandler(
            HANDLER_TYPES.GET_BALANCE,
            this.keyring,
          );

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
      handler: async (opts, metadata, transactions, transactionId) => {
        const { message, sender, callback } = opts;

        const { id: callId } = message.data.data;
        const { id: portId } = sender;

        getApp(this.keyring?.currentWalletId.toString(), metadata.url, async (app = {}) => {
          if (app?.status === CONNECTION_STATUS.accepted) {
            const transactionsError = !validateTransactions(transactions);

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
                transactionId,
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
      handler: async (opts, accepted, transactions, callId, portId) => {
        const { callback } = opts;
        if (accepted) {
          getBatchTransactions(async (err, batchTransactions) => {
            const newBatchTransactionId = crypto.randomUUID();
            const updatedBatchTransactions = {
              ...batchTransactions,
              [newBatchTransactionId]: transactions
                .map((tx) => ({
                  canisterId: tx.canisterId, methodName: tx.methodName, args: tx.arguments,
                })),
            };
            setBatchTransactions(updatedBatchTransactions);
            callback(null, true);
            callback(null, { status: accepted, txId: newBatchTransactionId }, [{ callId, portId }]);
          });
        } else {
          callback(ERRORS.TRANSACTION_REJECTED, { status: false }, [{ callId, portId }]);
          callback(null, true);
        }
      },
    };
  }

  #requestCall() {
    return {
      methodName: 'requestCall',
      handler: async (opts, metadata, args, batchTxId, transactionId) => {
        const { message, sender, callback } = opts;
        const { id: callId } = message.data.data;
        const { id: portId } = sender;
        const { currentWalletId } = this.keyring;
        const { canisterId, arg, methodName } = args;
        const senderPID = (await this.keyring.getState()).wallets[
          currentWalletId
        ]
          .principal;
        try {
          getApp(
            this.keyring.currentWalletId.toString(),
            metadata.url,
            async (app = {}) => {
              if (app.status !== CONNECTION_STATUS.accepted) {
                callback(ERRORS.CONNECTION_ERROR, null);
                return;
              }
              if (canisterId && !(canisterId in app.whitelist)) {
                callback(
                  ERRORS.CANISTER_NOT_WHITLESTED_ERROR(canisterId),
                  null,
                );
                return;
              }
              getProtectedIds(async (protectedIds) => {
                const canisterInfo = app.whitelist[canisterId];
                const shouldShowModal = (!batchTxId || batchTxId.lenght === 0)
                  && protectedIds.includes(canisterInfo.id);
                const requestInfo = generateRequestInfo({ ...args, sender: senderPID });

                if (shouldShowModal) {
                  this.displayPopUp({
                    callId,
                    portId,
                    type: 'sign',
                    argsJson: JSON.stringify({
                      transactionId,
                      canisterInfo,
                      requestInfo,
                      timeout: app?.timeout,
                    }),
                    metadataJson: JSON.stringify(metadata),
                  });
                } else {
                  getBatchTransactions((batchTransactions) => {
                    const savedBatchTrx = batchTxId
                      ? batchTransactions[batchTxId].shift()
                      : undefined;

                    setBatchTransactions({
                      ...batchTransactions,
                    }, () => {
                      handleCallRequest({
                        keyring: this.keyring,
                        request: {
                          arguments: arg, methodName, canisterId, savedBatchTrx, batchTxId,
                        },
                        portId,
                        callId,
                        callback,
                      });
                    });
                  });
                }
              });
            },
          );
        } catch (e) {
          callback(ERRORS.SERVER_ERROR(e), null);
        }
      },
    };
  }

  #handleCall() {
    return {
      methodName: 'handleCall',
      handler: async (opts, status, request, callId, portId) => {
        const { callback } = opts;

        if (status === CONNECTION_STATUS.accepted) {
          await handleCallRequest({
            keyring: this.keyring, request, portId, callId, callback, redirected: true,
          });
        } else {
          callback(ERRORS.SIGN_REJECTED, null, [{ portId, callId }]);
          callback(null, true); // Return true to close the modal
        }
      },
    };
  }

  #requestReadState() {
    return {
      methodName: 'requestReadState',
      handler: async (opts, { canisterId, paths }) => {
        const { callback } = opts;

        try {
          const response = await this.keyring.getAgent().readState(canisterId, {
            paths: [paths.map((path) => blobFromBuffer(base64ToBuffer(path)))],
          });
          callback(null, {
            certificate: bufferToBase64(blobToUint8Array(response.certificate)),
          });
        } catch (e) {
          callback(ERRORS.SERVER_ERROR(e), null);
        }
      },
    };
  }

  #requestQuery() {
    return {
      methodName: 'requestQuery',
      handler: async (opts, { canisterId, methodName, arg }) => {
        const { callback } = opts;

        try {
          const response = await this.keyring.getAgent()
            .query(canisterId, { methodName, arg: blobFromBuffer(base64ToBuffer(arg)) });

          if (response.reply) {
            response.reply.arg = bufferToBase64(blobToUint8Array(response.reply.arg));
          }

          callback(null, response);
        } catch (e) {
          callback(ERRORS.SERVER_ERROR(e), null);
        }
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

export default { TransactionModule };
