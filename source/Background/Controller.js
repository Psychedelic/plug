import qs from 'query-string';
import extension from 'extensionizer';
import { BackgroundController } from '@fleekhq/browser-rpc';
import { getAllNFTS } from '@psychedelic/dab-js';
import { HttpAgent } from '@dfinity/agent';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { areAllElementsIn } from '@shared/utils/array';
import PlugController from '@psychedelic/plug-controller';
import { validatePrincipalId } from '@shared/utils/ids';
import { E8S_PER_ICP, CYCLES_PER_TC } from '@shared/constants/currencies';
import { XTC_FEE } from '@shared/constants/addresses';
import {
  /* PROTECTED_CATEGORIES, */ ASSET_CANISTER_IDS,
  DAB_CANISTER_ID,
} from '@shared/constants/canisters';
import { addDisconnectedEntry } from '@shared/utils/apps';
import NotificationManager from '../lib/NotificationManager';
import SIZES from '../Pages/Notification/components/Transfer/constants';
import {
  getKeyringHandler,
  HANDLER_TYPES,
  getKeyringErrorMessage,
} from './Keyring';
import {
  validateTransferArgs,
  validateBurnArgs,
  validateTransactions,
} from './utils';
import ERRORS, { SILENT_ERRORS } from './errors';
import plugProvider from '../Inpage/index';

const DEFAULT_CURRENCY_MAP = {
  ICP: 0,
  XTC: 1,
};

const storage = extension.storage.local;
let keyring;

const backgroundController = new BackgroundController({
  name: 'bg-script',
  trustedSources: ['plug-content-script', 'notification-port'],
});

const notificationManager = new NotificationManager(
  extension.extension.getURL('../assets/icons/plug.svg'),
);

backgroundController.start();

const fetchCanistersInfo = async (whitelist) => {
  if (whitelist && whitelist.length > 0) {
    const canistersInfo = await Promise.all(
      whitelist.map(async (id) => {
        let canisterInfo = { id };

        try {
          const fetchedCanisterInfo = await PlugController.getCanisterInfo(id);
          canisterInfo = { id, ...fetchedCanisterInfo };
        } catch (error) {
          /* eslint-disable-next-line */
          console.error(error);
        }

        return canisterInfo;
      }),
    );

    const sortedCanistersInfo = canistersInfo.sort((a, b) => {
      if (a.name && !b.name) return -1;
      return 1;
    });

    return sortedCanistersInfo;
  }

  return [];
};

export const init = async () => {
  keyring = new PlugController.PlugKeyRing();
  await keyring.init();
  if (keyring.isUnlocked) {
    await keyring?.getState();
  }
};

// keyring handlers
extension.runtime.onMessage.addListener((message, _, sendResponse) => {
  const handleOnMessage = () => {
    const { params, type } = message;
    const keyringHandler = getKeyringHandler(type, keyring);
    if (!keyringHandler) return;

    keyringHandler(params)
      .then((res) => sendResponse(res))
      .catch(() => {
        const keyringErrorMessage = getKeyringErrorMessage(type);
        const errorMessage = keyringErrorMessage
          ? `Unexpected error while ${keyringErrorMessage}`
          : 'Unexpected error';
        notificationManager.notificateError(errorMessage);
      });
  };

  if (!keyring) {
    init().then(() => {
      handleOnMessage();
    });
  } else {
    handleOnMessage();
  }

  // Usually we would not return, but it seems firefox needs us to
  return true; // eslint-disable-line
});

const isInitialized = async () => {
  await keyring?.init();
  const getLocks = getKeyringHandler(HANDLER_TYPES.GET_LOCKS, keyring);

  if (!getLocks) return false;

  const locks = await getLocks();

  return locks?.isInitialized;
};

const secureController = async (callback, controller) => {
  const initialized = await isInitialized();

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
    notificationManager.notificateError(e.message);
  }
};

backgroundController.exposeController('isConnected', async (opts, url) => secureController(opts.callback, async () => {
  const { callback } = opts;

  storage.get(keyring.currentWalletId.toString(), (state) => {
    const apps = state?.[keyring.currentWalletId]?.apps || {};
    if (apps?.[url]) {
      callback(null, apps?.[url].status === CONNECTION_STATUS.accepted);
    } else {
      callback(null, false);
    }
  });
}));

backgroundController.exposeController('disconnect', async (opts, url) => secureController(opts.callback, async () => {
  storage.get(keyring.currentWalletId.toString(), (response) => {
    const apps = response?.[keyring.currentWalletId]?.apps;

    if (apps?.[url]) {
      const newApps = addDisconnectedEntry({ apps, url });
      storage.set({ [keyring.currentWalletId]: { apps: newApps } });
    } else {
      opts.callback(ERRORS.CONNECTION_ERROR, null);
    }
  });
}));

backgroundController.exposeController(
  'requestConnect',
  async (opts, metadata, whitelist, timeout) => secureController(opts.callback, async () => {
    let canistersInfo = [];
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

    storage.get(keyring.currentWalletId.toString(), (response) => {
      const apps = {
        ...response?.[keyring.currentWalletId]?.apps,
        [domainUrl]: {
          url: domainUrl,
          name,
          status: CONNECTION_STATUS.pending,
          icon: icons[0] || null,
          timeout,
          date,
          events: [
            ...response?.[keyring.currentWalletId]?.apps[domainUrl].events,
          ],
        },
      };

      storage.set({ [keyring.currentWalletId]: { apps } });
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

      const height = keyring?.isUnlocked
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

      const height = keyring?.isUnlocked
        ? SIZES.appConnectHeight
        : SIZES.loginHeight;

      extension.windows.create({
        url,
        type: 'popup',
        width: SIZES.width,
        height,
      });
    }
  }),
);

const requestBalance = async (accountId, callback) => {
  const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, keyring);
  const icpBalance = await getBalance(accountId);
  if (icpBalance.error) {
    callback(ERRORS.SERVER_ERROR(icpBalance.error), null);
  } else {
    callback(null, icpBalance);
  }
};

backgroundController.exposeController(
  'requestBalance',
  async (opts, metadata, accountId) => secureController(opts.callback, async () => {
    const { callback, message, sender } = opts;

    storage.get(keyring.currentWalletId.toString(), async (state) => {
      const app = state?.[keyring.currentWalletId]?.apps?.[metadata.url] || {};
      if (app?.status === CONNECTION_STATUS.accepted) {
        if (Number.isNaN(parseInt(accountId, 10))) {
          callback(ERRORS.CLIENT_ERROR('Invalid account id'), null);
        } else if (!keyring.isUnlocked) {
          const url = qs.stringifyUrl({
            url: 'notification.html',
            query: {
              callId: message.data.data.id,
              portId: sender.id,
              type: 'balance',
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
          requestBalance(accountId, callback);
        }
      } else {
        callback(ERRORS.CONNECTION_ERROR, null);
      }
    });
  }),
);

backgroundController.exposeController(
  'handleRequestBalance',
  async (opts, url, accountId, callId, portId) => {
    const { callback } = opts;
    storage.get(keyring.currentWalletId.toString(), async (state) => {
      const app = state?.[keyring.currentWalletId]?.apps?.[url] || {};
      callback(null, true);
      if (app?.status === CONNECTION_STATUS.accepted) {
        const getBalance = getKeyringHandler(
          HANDLER_TYPES.GET_BALANCE,
          keyring,
        );
        const icpBalance = await getBalance(accountId);
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
);

backgroundController.exposeController(
  'requestTransfer',
  async (opts, metadata, args) => secureController(opts.callback, async () => {
    const { message, sender, callback } = opts;

    const { id: callId } = message.data.data;
    const { id: portId } = sender;
    storage.get(keyring.currentWalletId.toString(), async (state) => {
      const app = state?.[keyring.currentWalletId]?.apps?.[metadata?.url] || {};
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

        const height = keyring?.isUnlocked
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
  }),
);

backgroundController.exposeController(
  'handleRequestTransfer',
  async (opts, transferRequests, callId, portId) => {
    const { callback } = opts;
    const transfer = transferRequests?.[0];

    // Answer this callback no matter if the transfer succeeds or not.
    if (transfer?.status === 'declined') {
      callback(null, true);
      callback(ERRORS.TRANSACTION_REJECTED, null, [{ portId, callId }]);
    } else {
      const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, keyring);
      const sendToken = getKeyringHandler(HANDLER_TYPES.SEND_TOKEN, keyring);
      const assets = await getBalance();
      if (
        assets?.[DEFAULT_CURRENCY_MAP.ICP]?.amount * E8S_PER_ICP
        > transfer.amount
      ) {
        const response = await sendToken(transfer);
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
);

backgroundController.exposeController(
  'requestSign',
  async (opts, payload, metadata, requestInfo) => {
    const { message, sender, callback } = opts;
    const { id: callId } = message.data.data;
    const { id: portId } = sender;
    const { canisterId, requestType, preApprove } = requestInfo;

    try {
      storage.get(keyring.currentWalletId.toString(), async (state) => {
        const app = state?.[keyring.currentWalletId]?.apps?.[metadata.url] || {};
        if (app.status !== CONNECTION_STATUS.accepted) {
          callback(ERRORS.CONNECTION_ERROR, null);
          return;
        }

        if (
          requestType !== 'read_state'
          && canisterId
          && !(canisterId in app.whitelist)
        ) {
          callback(ERRORS.CANISTER_NOT_WHITLESTED_ERROR(canisterId), null);
          return;
        }
        const canisterInfo = app.whitelist[canisterId];
        // TODO REMOVE THIS FOR CATEGORY ATTRIBUTE
        const nftCanisters = await getAllNFTS(
          new HttpAgent({
            canisterId: DAB_CANISTER_ID,
            host: 'https://mainnet.dfinity.network',
          }),
        );
        const PROTECTED_IDS = [
          ...(nftCanisters || []).map((collection) => collection.principal_id.toString()),
          ...ASSET_CANISTER_IDS,
        ];
        const shouldShowModal = !preApprove
          && (requestInfo.manual
            || (requestInfo.requestType === 'call'
              && !!canisterInfo.id
              && PROTECTED_IDS.includes(canisterInfo.id)));
        // const shouldShowModal = requestInfo.manual || (requestInfo.requestType === 'call'
        // && !!canisterInfo.category && canisterInfo.category in PROTECTED_CATEGORIES);

        if (shouldShowModal) {
          const url = qs.stringifyUrl({
            url: 'notification.html',
            query: {
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
            },
          });

          const height = keyring?.isUnlocked
            ? SIZES.appConnectHeight
            : SIZES.loginHeight;

          extension.windows.create({
            url,
            type: 'popup',
            width: SIZES.width,
            height,
          });
        } else {
          const parsedPayload = new Uint8Array(Object.values(payload));

          const signed = await keyring.sign(parsedPayload.buffer);
          callback(null, [...new Uint8Array(signed)]);
        }
      });
    } catch (e) {
      callback(ERRORS.SERVER_ERROR(e), null);
    }
  },
);

backgroundController.exposeController(
  'handleSign',
  async (opts, status, payload, callId, portId) => {
    const { callback } = opts;

    if (status === CONNECTION_STATUS.accepted) {
      try {
        const parsedPayload = new Uint8Array(Object.values(payload));

        const signed = await keyring.sign(parsedPayload.buffer);
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
);

backgroundController.exposeController('getPublicKey', async (opts) => {
  const { callback } = opts;
  try {
    const publicKey = await keyring.getPublicKey();
    callback(null, publicKey);
  } catch (e) {
    callback(ERRORS.SERVER_ERROR(e), null);
  }
});

backgroundController.exposeController(
  'verifyWhitelist',
  async (opts, metadata, whitelist) => secureController(opts.callback, async () => {
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

    storage.get(keyring.currentWalletId.toString(), async (state) => {
      const app = state?.[keyring.currentWalletId]?.apps?.[metadata.url] || {};
      if (app?.status === CONNECTION_STATUS.accepted) {
        const allWhitelisted = areAllElementsIn(
          whitelist,
          app?.whitelist ? Object.keys(app?.whitelist) : [],
        );
        const height = keyring?.isUnlocked
          ? SIZES.detailHeightSmall
          : SIZES.loginHeight;

        if (allWhitelisted) {
          if (!keyring.isUnlocked) {
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
          const publicKey = await keyring.getPublicKey();
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
    });
  }),
);

backgroundController.exposeController(
  'handleAllowAgent',
  async (opts, url, response, callId, portId) => {
    const { callback } = opts;
    storage.get(keyring.currentWalletId.toString(), async (state) => {
      const apps = state?.[keyring.currentWalletId]?.apps || {};
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
            ...apps[url].events,
            {
              status: status || CONNECTION_STATUS.rejected,
              date,
            },
          ],
        },
      };
      storage.set({ [keyring.currentWalletId]: { apps: newApps } });
    });

    if (response?.status === CONNECTION_STATUS.accepted) {
      try {
        const publicKey = await keyring.getPublicKey();
        callback(null, publicKey, [{ portId, callId }]);
        callback(null, true);
      } catch (e) {
        callback(ERRORS.SERVER_ERROR(e), null, [{ portId, callId }]);
        callback(null, false);
      }
    } else {
      plugProvider.deleteAgent();
      callback(ERRORS.AGENT_REJECTED, null, [{ portId, callId }]);
      callback(null, true); // Return true to close the modal
    }
  },
);

backgroundController.exposeController(
  'batchTransactions',
  async (opts, metadata, transactions) => secureController(opts.callback, async () => {
    const { message, sender, callback } = opts;

    const { id: callId } = message.data.data;
    const { id: portId } = sender;

    storage.get(keyring.currentWalletId.toString(), async (state) => {
      const app = state?.[keyring.currentWalletId]?.apps?.[metadata?.url] || {};

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

        const height = keyring?.isUnlocked
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
  }),
);

backgroundController.exposeController(
  'handleBatchTransactions',
  async (opts, accepted, callId, portId) => {
    const { callback } = opts;
    callback(null, true); // close the modal
    if (accepted) {
      callback(null, accepted, [{ callId, portId }]);
    } else {
      callback(ERRORS.TRANSACTION_REJECTED, false, [{ callId, portId }]);
    }
  },
);

backgroundController.exposeController(
  'requestBurnXTC',
  async (opts, metadata, args) => secureController(opts.callback, async () => {
    const { message, sender, callback } = opts;

    const { id: callId } = message.data.data;
    const { id: portId } = sender;
    storage.get(keyring.currentWalletId.toString(), async (state) => {
      const app = state?.[keyring.currentWalletId]?.apps?.[metadata.url] || {};
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

        const height = keyring?.isUnlocked
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
  }),
);

backgroundController.exposeController(
  'handleRequestBurnXTC',
  async (opts, transferRequests, callId, portId) => {
    const { callback } = opts;
    const transfer = transferRequests?.[0];

    // Answer this callback no matter if the transfer succeeds or not.
    if (transfer?.status === 'declined') {
      callback(null, true);
      callback(ERRORS.TRANSACTION_REJECTED, null, [{ portId, callId }]);
    } else {
      const burnXTC = getKeyringHandler(HANDLER_TYPES.BURN_XTC, keyring);
      const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, keyring);
      const assets = await getBalance();
      const xtcAmount = assets?.[DEFAULT_CURRENCY_MAP.XTC]?.amount * CYCLES_PER_TC;

      if (xtcAmount - XTC_FEE > transfer.amount) {
        const response = await burnXTC(String(transfer));
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
);

backgroundController.exposeController('getPrincipal', async (opts, pageUrl) => secureController(opts.callback, async () => {
  const { callback, message, sender } = opts;
  storage.get(keyring.currentWalletId.toString(), async (state) => {
    const app = state?.[keyring.currentWalletId]?.apps?.[pageUrl] || {};
    if (app?.status === CONNECTION_STATUS.accepted) {
      if (!keyring.isUnlocked) {
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
          keyring.state.wallets[keyring.currentWalletId].principal,
        );
      }
    } else {
      callback(ERRORS.CONNECTION_ERROR, null);
    }
  });
}));

backgroundController.exposeController(
  'handleGetPrincipal',
  async (opts, url, callId, portId) => {
    const { callback } = opts;
    storage.get(keyring.currentWalletId.toString(), async (state) => {
      const app = state?.[keyring.currentWalletId]?.apps?.[url] || {};
      callback(null, true);
      if (app?.status === CONNECTION_STATUS.accepted) {
        const { principal } = keyring?.state?.wallets?.[keyring?.currentWalletId] || {};
        callback(null, principal?.toText(), [{ portId, callId }]);
      } else {
        callback(ERRORS.CONNECTION_ERROR, null, [{ portId, callId }]);
      }
    });
  },
);

backgroundController.exposeController(
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
      notificationManager.notificateError(errorMessage);
    }

    callback(ERRORS.CLIENT_ERROR(errorMessage), null, [{ portId, callId }]);
    callback(null, true);
  },
);

backgroundController.exposeController(
  'handleTimeout',
  async (opts, metadata, errorMessage) => {
    const { message, sender, callback } = opts;
    const { id: callId } = message.data.data;
    const { id: portId } = sender;

    notificationManager.notificateTimeout(errorMessage);

    callback(ERRORS.CLIENT_ERROR(errorMessage), null, [{ portId, callId }]);
    callback(null, true);
  },
);

export default backgroundController;
