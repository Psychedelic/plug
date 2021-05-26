import qs from 'query-string';
import extension from 'extensionizer';
import { BackgroundController } from '@fleekhq/browser-rpc';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import CYCLE_WITHDRAWAL_SIZES from '../Pages/CycleWithdrawal/constants';

const storage = extension.storage.local;

storage.set({
  requests: [],
  open: false,
});

storage.get(['open'], (state) => {
  const isOpen = state.open;

  console.log('isOpen', isOpen);
});

const backgroundController = new BackgroundController({
  name: 'bg-script',
  trustedSources: [
    'plug-content-script',
    'notification-port',
    'app-connection-port',
    'cycle-withdrawal-port',
  ],
});

backgroundController.exposeController('isConnected', ({ callback }, url) => {
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
  ({ message, sender }, metadata, timeout) => {
    const icon = metadata.icons[0] || null;

    storage.set({
      [metadata.url]: {
        url: metadata.url,
        name: metadata.name,
        status: CONNECTION_STATUS.pending,
        icon,
        timeout,
      },
    });

    const url = qs.stringifyUrl({
      url: 'notification.html',
      query: {
        callId: message.data.data.id,
        portId: sender.id,
        url: metadata.url,
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
  async ({ callback }, url, status, callId, portId) => {
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

    if (status === CONNECTION_STATUS.accepted) {
      callback(null, status === CONNECTION_STATUS.accepted, [
        { portId, callId },
      ]);
    } else {
      callback(
        { code: -32001, message: 'User rejected the connection' },
        null,
        [{ portId, callId }],
      );
    }
  },
);

backgroundController.exposeController(
  'dankProxyRequest',
  ({ callback, message, sender }, requests) => {
    requests.forEach((r) => {
      const site = r.url;
      storage.get([site], (state) => {
        if (state[site]) {
          const metadata = state[site];

          if (metadata.status !== CONNECTION_STATUS.accepted) {
            callback({ code: -32000, message: 'User is not connected' }, null);
          }
        } else {
          callback({ code: -32000, message: 'User is not connected' }, null);
        }
      });
    });

    storage.get(['requests'], (state) => {
      const storedRequests = state.requests;

      if (storedRequests && storedRequests.length > 0) {
        storage.set({
          requests: [...storedRequests, ...requests],
        });
      } else {
        storage.set({
          requests,
        });
      }
    });

    const url = qs.stringifyUrl({
      url: 'cycle-withdrawal.html',
      query: {
        callId: message.data.data.id,
        portId: sender.id,
      },
    });

    storage.get(['open'], (state) => {
      const isOpen = state.open;

      console.log('isOpen', isOpen);

      if (!isOpen) {
        extension.windows.create({
          url,
          type: 'popup',
          width: CYCLE_WITHDRAWAL_SIZES.width,
          height:
            requests.length > 1
              ? CYCLE_WITHDRAWAL_SIZES.detailsHeightBig
              : CYCLE_WITHDRAWAL_SIZES.detailHeightSmall,
        });

        storage.set({
          open: true,
        });
      }
    });
  },
);

// const agent = new HttpAgent();  // need the data to create agent
// const dankActor = Actor.createActor(idl, { agent, canisterId});

backgroundController.exposeController(
  'handleDankProxyRequest',
  async ({ callback }, callId, portId) => {
    storage.get(['requests'], (state) => {
      const { requests } = state;

      requests.forEach((r) => {
        if (r.status === 'accepted') {
          const { url } = r;
          let timeout = 5000; // default timeout?
          storage.get([url], (sites) => {
            if (sites[url]) {
              timeout = sites[url].timeout; // get timeout from storage
            }
          });
          console.log('timeout', timeout);
          // call dank proxy using timeout from connection
          // await dankActor.proxyCall(r.canisterId, r.methodName, r.args, r.options.cycles);
          console.log('accepted, calling dank proxy');

          // change state of accepted requests to finished or something?

          // await dank response
        } else {
          console.log('rejected');
        }
      });

      storage.set({
        requests: requests.filter((sr) => sr.status === 'pending'), // what to leave here? delete all?
        open: false,
      });

      callback(null, true);
      callback(null, requests, [{ portId, callId }]); // return dank response here
    });
  },
);

export default backgroundController;
