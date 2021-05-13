import qs from 'query-string';
import extension from 'extensionizer';
import { BackgroundController } from '@fleekhq/browser-rpc';

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
  (opts, domainUrl, icon) => {
    const { message, sender } = opts;

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
  (opts, access, callId, portId) => {
    const { callback } = opts;

    console.log('access', access);
    console.log('callId', callId);
    console.log('portId', portId);

    callback(null, true);
    callback(null, access, [{ portId, callId }]);
  },
);

export default backgroundController;
