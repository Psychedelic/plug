import qs from 'query-string';
import extension from 'extensionizer';
import { BackgroundController } from '@fleekhq/browser-rpc';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { areAllElementsIn } from '@shared/utils/array';
import PlugController from '@psychedelic/plug-controller';
import { validatePrincipalId } from '@shared/utils/ids';
import { E8S_PER_ICP } from '@shared/constants/currencies';

import SIZES from '../Pages/Notification/components/Transfer/constants';
import { getKeyringHandler, HANDLER_TYPES } from './Keyring';
import { validateTransferArgs } from './utils';
import ERRORS from './errors';
import plugProvider from '../Inpage/index';

const storage = extension.storage.local;
let keyring;

const backgroundController = new BackgroundController({
  name: 'bg-script',
  trustedSources: ['plug-content-script', 'notification-port'],
});

backgroundController.start();

export const init = async () => {
  keyring = new PlugController.PlugKeyRing();
  await keyring.init();
  if (keyring.isUnlocked) {
    await keyring?.getState();
  }
};

// keyring handlers
extension.runtime.onMessage.addListener((message, _, sendResponse) => {
  const { params, type } = message;
  const keyringHandler = getKeyringHandler(type, keyring);
  if (!keyringHandler) return;
  keyringHandler(params).then((response) => sendResponse(response));
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
  controller();
};

backgroundController.exposeController('isConnected', async (opts, url) => secureController(opts.callback, async () => {
  const { callback } = opts;

  storage.get('apps', (state) => {
    if (state?.apps?.[url]) {
      callback(
        null,
        state?.apps?.[url].status === CONNECTION_STATUS.accepted,
      );
    } else {
      callback(null, false);
    }
  });
}));

backgroundController.exposeController(
  'requestConnect',
  async (opts, metadata, whitelist) => secureController(opts.callback, async () => {
    const isValidWhitelist = Array.isArray(whitelist) && whitelist.length;

    if (!whitelist.every((canisterId) => validatePrincipalId(canisterId))) {
      opts.callback(ERRORS.CANISTER_ID_ERROR, null);
      return;
    }

    const { message, sender } = opts;
    const { id: callId } = message.data.data;
    const { id: portId } = sender;
    const { url: domainUrl, name, icons } = metadata;

    storage.get('apps', (response) => {
      const apps = {
        ...response.apps,
        [domainUrl]: {
          url: domainUrl,
          name,
          status: CONNECTION_STATUS.pending,
          icon: icons[0] || null,
        },
      };

      storage.set({ apps });
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
          argsJson: JSON.stringify({ whitelist }),
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
    storage.get('apps', async (state) => {
      if (
        state?.apps?.[metadata.url]?.status === CONNECTION_STATUS.accepted
      ) {
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
    storage.get('apps', async (state) => {
      callback(null, true);
      if (state?.apps?.[url]?.status === CONNECTION_STATUS.accepted) {
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
    storage.get('apps', async (state) => {
      if (
        state?.apps?.[metadata.url]?.status === CONNECTION_STATUS.accepted
      ) {
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
            argsJson: JSON.stringify(args),
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
      if (assets?.[0]?.amount * E8S_PER_ICP > transfer.amount) {
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
  'sign',
  async (opts, payload, metadata) => {
    const { callback } = opts;
    try {
      storage.get('apps', async (state) => {
        if (
          state?.apps?.[metadata.url]?.status !== CONNECTION_STATUS.accepted
        ) {
          callback(ERRORS.CONNECTION_ERROR, null);
          return;
        }
        const parsedPayload = payload instanceof Buffer
          ? payload
          : Buffer.from(Object.values(payload));
        const signed = await keyring.sign(parsedPayload);
        callback(null, [...new Uint8Array(signed)]);
      });
    } catch (e) {
      callback(ERRORS.SERVER_ERROR(e), null);
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

    if (!whitelist.every((canisterId) => validatePrincipalId(canisterId))) {
      callback(ERRORS.CANISTER_ID_ERROR, null);
      return;
    }

    storage.get('apps', async (state) => {
      const app = state?.apps?.[metadata.url];
      if (app?.status === CONNECTION_STATUS.accepted) {
        const allWhitelisted = areAllElementsIn(whitelist, app?.whitelist);
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
                  updateWhitelist: true,
                  showList: false,
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
    storage.get('apps', (state) => {
      const apps = state.apps || {};
      const status = response.status === CONNECTION_STATUS.rejectedAgent
        ? CONNECTION_STATUS.accepted
        : response.status;
      const whitelist = response.status === CONNECTION_STATUS.accepted
        ? response.whitelist
        : [];

      const newApps = Object.keys(apps).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = apps[key];
        if (key === url) {
          newObj[key].status = status || CONNECTION_STATUS.rejected;
          newObj[key].date = new Date().toISOString();
          newObj[key].whitelist = whitelist;
        }
        return newObj;
      }, {});

      storage.set({ apps: newApps });
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

export default backgroundController;
