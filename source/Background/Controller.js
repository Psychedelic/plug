import qs from 'query-string';
import extension from 'extensionizer';
import { BackgroundController } from '@fleekhq/browser-rpc';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import PlugController from '@psychedelic/plug-controller';
import SIZES from '../Pages/Notification/components/Transfer/constants';
import { E8S_PER_ICP, getKeyringHandler, HANDLER_TYPES } from './Keyring';
import { validateTransferArgs } from './utils';
import ERRORS from './errors';

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
  const keyringHandler = getKeyringHandler(HANDLER_TYPES.GET_LOCKS, keyring);

  if (!keyringHandler) return false;

  const locks = await keyringHandler();

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
  async (opts, domainUrl, name, icon) => secureController(opts.callback, async () => {
    const { message, sender } = opts;
    storage.get('apps', (response) => {
      const apps = {
        ...response.apps,
        [domainUrl]: {
          url: domainUrl,
          name,
          status: CONNECTION_STATUS.pending,
          icon,
        },
      };

      storage.set({ apps });
    });

    const url = qs.stringifyUrl({
      url: 'notification.html',
      query: {
        callId: message.data.data.id,
        portId: sender.id,
        url: domainUrl,
        icon,
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
  }),
);

backgroundController.exposeController(
  'handleAppConnect',
  async (opts, url, status, callId, portId) => secureController(opts.callback, async () => {
    const { callback } = opts;

    storage.get('apps', (response) => {
      const apps = response.apps || {};

      const newApps = Object.keys(apps).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = apps[key];
        if (key === url) {
          newObj[key].status = status || CONNECTION_STATUS.rejected;
          newObj[key].date = new Date().toISOString();
        }

        return newObj;
      }, {});

      storage.set({ apps: newApps });
    });

    callback(null, true);
    callback(null, status === CONNECTION_STATUS.accepted, [
      { portId, callId },
    ]);
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
    callback(null, true);
    if (transfer?.status === 'declined') {
      callback(ERRORS.TRANSACTION_REJECTED, null, [{ portId, callId }]);
    } else {
      const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, keyring);
      const sendICP = getKeyringHandler(HANDLER_TYPES.SEND_ICP, keyring);
      const assets = await getBalance();
      if (assets?.[0]?.amount * E8S_PER_ICP > transfer.amount) {
        const response = await sendICP(transfer);
        if (response.error) {
          callback(ERRORS.SERVER_ERROR(response.error), null, [
            { portId, callId },
          ]);
        } else {
          callback(null, response, [{ portId, callId }]);
        }
      } else {
        callback(ERRORS.BALANCE_ERROR, null, [{ portId, callId }]);
      }
    }
  },
);

export default backgroundController;
