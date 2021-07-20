import qs from 'query-string';
import extension from 'extensionizer';
import { BackgroundController } from '@fleekhq/browser-rpc';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import PlugController from '@psychedelic/plug-controller';
import SIZES from '../Pages/Notification/components/Transfer/constants';
import { getKeyringHandler, HANDLER_TYPES } from './Keyring';

const storage = extension.storage.local;
let keyring;

const backgroundController = new BackgroundController({
  name: 'bg-script',
  trustedSources: ['plug-content-script', 'notification-port'],
});

backgroundController.start();
const CONNECTION_ERROR = {
  code: 401,
  message:
    'You are not connected. You must call window.ic.plug.requestConnect() and have the user accept the popup before you call this method.',
};

const INITIALIZED_ERROR = {
  code: 403,
  message: 'Plug must be initialized.',
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
    callback(INITIALIZED_ERROR, null);
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
        state?.apps?.apps?.[url].status === CONNECTION_STATUS.accepted,
      );
    } else {
      callback(null, false);
    }
  });
}));

backgroundController.exposeController('requestConnect', async (opts, domainUrl, name, icon) => secureController(opts.callback, async () => {
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
}));

backgroundController.exposeController('handleAppConnect', async (opts, url, status, callId, portId) => secureController(opts.callback, async () => {
  const { callback } = opts;

  storage.get('apps', (response) => {
    const apps = response.apps || {};

    const newApps = Object.keys(apps).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = apps[key];

      if (key === url) {
        newObj[key].status = status;
      }

      return newObj;
    }, {});

    storage.set({ apps: newApps });
  });

  callback(null, true);
  callback(null, status === CONNECTION_STATUS.accepted, [{ portId, callId }]);
}));

const requestBalance = async (accountId, callback) => {
  const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, keyring);
  const icpBalance = await getBalance(accountId);
  if (icpBalance.error) {
    callback({ message: icpBalance.error, code: 500 }, null);
  } else {
    callback(null, icpBalance);
  }
};

backgroundController.exposeController('requestBalance', async (opts, metadata, accountId) => secureController(opts.callback, async () => {
  const { callback, message, sender } = opts;

  storage.get('apps', async (state) => {
    if (state?.apps?.[metadata.url]?.status === CONNECTION_STATUS.accepted) {
      if (!keyring.isUnlocked) {
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
      callback(CONNECTION_ERROR, null);
    }
  });
}));

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
          callback({ message: icpBalance.error, code: 500 }, null, [
            { portId, callId },
          ]);
        } else {
          callback(null, icpBalance, [{ portId, callId }]);
        }
      } else {
        callback(CONNECTION_ERROR, null, [{ portId, callId }]);
      }
    });
  },
);

backgroundController.exposeController('requestTransfer', async (opts, metadata, args) => secureController(opts.callback, async () => {
  const { message, sender, callback } = opts;

  const initialized = await isInitialized();

  if (!initialized) {
    extension.tabs.create({
      url: 'options.html',
    });
    callback(INITIALIZED_ERROR, null);
    return;
  }

  const { id: callId } = message.data.data;
  const { id: portId } = sender;
  storage.get('apps', async (state) => {
    if (state?.apps?.[metadata.url]?.status === CONNECTION_STATUS.accepted) {
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
      callback(CONNECTION_ERROR, null);
    }
  });
}));

backgroundController.exposeController(
  'handleRequestTransfer',
  async (opts, transferRequests, callId, portId) => {
    const { callback } = opts;
    const transfer = transferRequests?.[0];

    // Answer this callback no matter if the transfer succeeds or not.
    callback(null, true);
    if (transfer?.status === 'declined') {
      callback({ code: 401, message: 'The transactions was rejected' }, null, [
        { portId, callId },
      ]);
    } else {
      const sendICP = getKeyringHandler(HANDLER_TYPES.SEND_ICP, keyring);
      const response = await sendICP(transfer);
      if (response.error) {
        callback({ code: 500, message: response.error }, null, [
          { portId, callId },
        ]);
      } else {
        callback(null, response, [{ portId, callId }]);
      }
    }
  },
);

export default backgroundController;
