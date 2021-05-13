import qs from 'query-string';
import extension from 'extensionizer';
import { BackgroundController } from '@fleekhq/browser-rpc';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';

const storage = extension.storage.local;

const backgroundController = new BackgroundController({
  name: 'bg-script',
  trustedSources: [
    'plug-content-script',
    'notification-port',
    'app-connection-port',
  ],
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
  (opts, url, status, callId, portId) => {
    const { callback } = opts;

    const storageItem = storage.get(url);

    storageItem.status = CONNECTION_STATUS[status];

    storage.set(storageItem);

    callback(null, true);
    callback(null, status, [{ portId, callId }]);
  },
);

backgroundController.exposeController('isConnected', (opts, url) => {
  const { callback } = opts;

  const storageItem = storage.get(url);

  const response = storageItem?.status === CONNECTION_STATUS.accepted;

  callback(null, response);
});

export default backgroundController;
