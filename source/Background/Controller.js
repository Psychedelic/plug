import qs from 'query-string';
import extension from 'extensionizer';
import { BackgroundController } from '@fleekhq/browser-rpc';

const backgroundController = new BackgroundController({
  name: 'bg-script',
  trustedSources: ['plug-content-script', 'notification-port'],
});

backgroundController.exposeController('requestAccess', (opts, appName) => {
  const { message, sender } = opts;

  const url = qs.stringifyUrl({
    url: 'notification.html',
    query: {
      callId: message.data.data.id,
      portId: sender.id,
      appName,
    },
  });

  extension.windows.create({
    url,
    type: 'popup',
  });
});

backgroundController.exposeController(
  'handleAppAccess',
  (opts, access, callId, portId) => {
    const { callback } = opts;

    callback(null, true);
    callback(null, access, [{ portId, callId }]);
  },
);

export default backgroundController;
