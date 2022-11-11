import qs from 'query-string';
import extension from 'extensionizer';

import { checkPendingTransaction, createPendingTransaction, removePendingTransaction } from '@modules/storageManager';
import ERRORS from '@background/errors';
import SIZES from '../../views/Popup/components/Transfer/constants';

const EXTENSION_URL = 'chrome-extension://cfbfdhimifdmdehjmkdobpcjfefblkjm';

export class ControllerModuleBase {
  constructor(backgroundController, secureController, keyring) {
    this.keyring = keyring;
    this.secureController = secureController;
    this.backgroundController = backgroundController;
  }

  secureWrapper({ args, handlerObject }) {
    return this.secureController(
      args[0].callback,
      async () => {
        handlerObject.handler(...args);
      },
    );
  }

  // Create non-accepted transaction ID in storage and pass it as first arg
  secureHandler({ handlerObject, args }) {
    return this.secureController(
      args[0].callback,
      async () => {
        createPendingTransaction((transactionId) => {
          handlerObject.handler(...args, transactionId);
        });
      },
    );
  }

  secureExecutor({ args: methodArgs = [], handlerObject }) {
    if (methodArgs[0].sender.port.sender.origin !== EXTENSION_URL) {
      throw new Error(ERRORS.UNAUTHORIZED_EXECUTION.message);
    }
    const transactionId = methodArgs.pop(methodArgs.length - 1);
    checkPendingTransaction(transactionId, (status) => {
      if (status !== 'reviewed') throw new Error(ERRORS.UNAUTHORIZED_EXECUTION.message);
      return this.secureController(
        methodArgs[0].callback,
        async () => {
          handlerObject.handler(...methodArgs);
          removePendingTransaction(transactionId, () => {
          });
        },
      );
    });
  }

  displayPopUp({
    url = 'notification.html',
    callId,
    portId,
    argsJson,
    metadataJson,
    type,
    icon,
    screenArgs: { fixedHeight, top, left } = {},
    domainUrl,
  }, callback) {
    const stringifiedUrl = qs.stringifyUrl({
      url,
      query: {
        callId,
        portId,
        type,
        icon,
        argsJson,
        metadataJson,
        url: domainUrl,
      },
    });
    const defaultHeight = this.keyring?.isUnlocked
      ? SIZES.detailHeightSmall
      : SIZES.loginHeight;
    const height = fixedHeight || defaultHeight;

    extension.windows.create({
      url: stringifiedUrl,
      type: 'popup',
      width: SIZES.width,
      height,
      top,
      left,
    }, (res, err) => {
      console.log('create window res', res, err);
      if (!res) {
        callback(ERRORS.SIZE_ERROR, null);
      }
    });
  }
}

export default { ControllerModuleBase };
