import qs from 'query-string';
import extension from 'extensionizer';
import PlugController from '@psychedelic/plug-controller';
import { BackgroundController } from '@fleekhq/browser-rpc';

import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import {
  getApps,
  setApps,
  ConnectionModule,
  TransactionModule,
  InformationModule,
  getProtectedIds,
} from '@modules';

import NotificationManager from '../lib/NotificationManager';
import SIZES from '../Pages/Notification/components/Transfer/constants';
import {
  getKeyringHandler,
  HANDLER_TYPES,
  getKeyringErrorMessage,
} from './Keyring';
import ERRORS, { SILENT_ERRORS } from './errors';

let keyring = {};

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
    const state = await keyring?.getState();
    if (!state?.wallets?.length > 0) {
      await keyring.lock();
    }
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
      .catch((e) => {
        const keyringErrorMessage = getKeyringErrorMessage(type);
        const errorMessage = keyringErrorMessage
          ? `Unexpected error while ${keyringErrorMessage}`
          : 'Unexpected error';
        console.warn(errorMessage);
        console.warn(e);
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

let connectionModule;
let transactionModule;
let informationModule;
init().then(() => {
  // Exposing module methods
  connectionModule = new ConnectionModule(backgroundController, secureController, keyring);
  connectionModule.exposeMethods();

  transactionModule = new TransactionModule(backgroundController, secureController, keyring);
  transactionModule.exposeMethods();

  informationModule = new InformationModule(backgroundController, secureController, keyring);
  informationModule.exposeMethods();
});

const signData = async (payload, callback) => {
  const parsedPayload = new Uint8Array(Object.values(payload));
  const signed = await keyring.sign(parsedPayload.buffer);
  callback(null, [...new Uint8Array(signed)]);
};

backgroundController.exposeController(
  'requestSign',
  async (opts, payload, metadata, requestInfo) => {
    const { message, sender, callback } = opts;
    const { id: callId } = message.data.data;
    const { id: portId } = sender;
    const { canisterId, requestType, preApprove } = requestInfo;

    try {
      const isDangerousUpdateCall = !preApprove && requestType === 'call';
      if (isDangerousUpdateCall) {
        getApps(keyring.currentWalletId.toString(), async (apps = {}) => {
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
              signData(payload, callback);
            }
          });
        });
      } else {
        signData(payload, callback);
      }
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
