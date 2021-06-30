import qs from 'query-string';
import extension from 'extensionizer';
import { BackgroundController } from '@fleekhq/browser-rpc';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import PlugController from '@psychedelic/plug-controller';
import CYCLE_WITHDRAWAL_SIZES from '../Pages/CycleWithdrawal/constants';
import { getKeyringHandler } from './Keyring';

const storage = extension.storage.local;

let keyring;

const backgroundController = new BackgroundController({
  name: 'bg-script',
  trustedSources: [
    'plug-content-script',
    'notification-port',
    'app-connection-port',
    'cycle-withdrawal-port',
    'keyring-port',
  ],
});

backgroundController.start();

export const init = async () => {
  keyring = new PlugController.PlugKeyRing();
  await keyring.init();
};

// keyring handlers
extension.runtime.onMessage.addListener(async (message, _, sendResponse) => {
  const { params, type } = message;
  const keyringHandler = getKeyringHandler(type, keyring);
  if (!keyringHandler) return;
  const response = await keyringHandler(params);
  sendResponse(response);
});

backgroundController.exposeController('isConnected', (opts, url) => {
  const { callback } = opts;

  storage.get([url], (state) => {
    if (state[url]) {
      callback(null, state[url].status === CONNECTION_STATUS.accepted);
    } else {
      callback(null, false);
    }
  });
});

backgroundController.exposeController(
  'requestConnect',
  (opts, domainUrl, name, icon) => {
    const { message, sender } = opts;

    storage.set({
      [domainUrl]: {
        url: domainUrl,
        name,
        status: CONNECTION_STATUS.pending,
        icon,
      },
    });

    const url = qs.stringifyUrl({
      url: 'notification.html',
      query: {
        callId: message.data.data.id,
        portId: sender.id,
        url: domainUrl,
        icon,
      },
    });

    extension.windows.create({
      url,
      type: 'popup',
      width: 436,
      height: 401,
    });
  },
);

backgroundController.exposeController(
  'handleAppConnect',
  async (opts, url, status, callId, portId) => {
    const { callback } = opts;

    let connection = null;

    storage.get([url], (state) => {
      if (state[url]) {
        connection = state[url];
        connection.status = status;

        storage.set({
          [url]: {
            ...connection,
          },
        });
      }
    });

    callback(null, true);
    callback(null, status === CONNECTION_STATUS.accepted, [{ portId, callId }]);
  },
);

backgroundController.exposeController(
  'requestCycleWithdrawal',
  (opts, metadata, requests) => {
    const { message, sender } = opts;

    const url = qs.stringifyUrl({
      url: 'cycle-withdrawal.html',
      query: {
        callId: message.data.data.id,
        portId: sender.id,
        metadataJson: JSON.stringify(metadata),
        incomingRequestsJson: JSON.stringify(requests),
      },
    });

    extension.windows.create({
      url,
      type: 'popup',
      width: CYCLE_WITHDRAWAL_SIZES.width,
      height:
        requests.length > 1
          ? CYCLE_WITHDRAWAL_SIZES.detailsHeightBig
          : CYCLE_WITHDRAWAL_SIZES.detailHeightSmall,
    });
  },
);

backgroundController.exposeController(
  'handleCycleWithdrawal',
  async (opts, requests, callId, portId) => {
    const { callback } = opts;

    callback(null, true);
    callback(null, requests, [{ portId, callId }]);
  },
);

export default backgroundController;
