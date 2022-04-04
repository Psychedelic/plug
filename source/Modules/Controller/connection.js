import qs from 'query-string';
import extension from 'extensionizer';
import ERRORS from '@background/errors';
import PlugController from '@psychedelic/plug-controller';
import { validatePrincipalId } from '@shared/utils/ids';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import {
  getApps,
  setApps,
  getApp,
  removeApp
} from '../storageManager';
import SIZES from '../../Pages/Notification/components/Transfer/constants';

// Utils
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

// Handler objects
const isConnected = {
  methodName: 'isConnected',
  handler: async (opts, url, keyring) => {
    const { callback } = opts;

    getApp(keyring.currentWalletId.toString(), url, (app) => {
      if (app) {
        callback(null, app.status === CONNECTION_STATUS.accepted);
        return;
      }

      callback(null, false);
    });
  },
};

const disconnect = {
  methodName: 'disconnect',
  handler: async (opts, url, keyring) => {
    removeApp(keyring.currentWalletId.toString(), url, (removed) => {
      if (!removed) {
        opts.callback(ERRORS.CONNECTION_ERROR, null);
      }
    });
  },
};

const requestConnect = {
  methodName: 'requestConnect',
  handler: async (opts, metadata, whitelist, timeout, keyring) => {
    console.log('handler opts ->', opts);
    console.log('handler metadata ->', metadata);
    console.log('handler keyring ->', keyring);
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

    getApps(keyring.currentWalletId.toString(), (apps = {}) => {
      const newApps = {
        ...apps,
        [domainUrl]: {
          url: domainUrl,
          name,
          status: CONNECTION_STATUS.pending,
          icon: icons[0] || null,
          timeout,
          date,
          events: [
            ...apps[domainUrl]?.events || [],
          ],
          whitelist,
        },
      };
      setApps(keyring.currentWalletId.toString(), newApps);
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

      return;
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
  },
};

export const HANDLER_OBJECTS = [isConnected, disconnect, requestConnect];

export class connectionModule {
  constructor(backgroundController, secureController, keyring) {
    this.backgroundController = backgroundController;
    this.secureController = secureController;
    this.keyring = keyring;
  }

  #secureWrapper({ args, handlerObject }) {
    return this.secureController(
      args[0].callback,
      async () => {
        handlerObject.handler(...args, this.keyring);
      }
    );
  }

  exposeMethods(backgroundController) {
    HANDLER_OBJECTS.forEach(handlerObject => {
      backgroundController.exposeController(
        handlerObject.methodName,
        async (...args) => this.#secureWrapper({ args, handlerObject })
      );
    });
  }
}
