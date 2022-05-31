import qs from 'query-string';
import extension from 'extensionizer';
import { v4 as uuidv4 } from 'uuid';

import SIZES from '../../Pages/Notification/components/Transfer/constants';

export class ControllerModuleBase {
  constructor(backgroundController, secureController, keyring) {
    this.keyring = keyring;
    this.secureController = secureController;
    this.backgroundController = backgroundController;
    this.activeTransactions = {};
  }

  secureWrapper({ args, handlerObject, modifier }) {
    return this.secureController(
      args[0].callback,
      async () => {
        modifier?.();
        handlerObject.handler(...args);
      },
    );
  }

  initTransaction(type, args) {
    const transactionId = uuidv4();
    this.activeTransactions[transactionId] = { type, args, status: 'pending' };
  }

  checkTransaction(id, args) {
    const transaction = this.activeTransactions[id];
    if (!transaction) {
      return false;
    }
    return transaction.status === 'confirmed' && JSON.stringify(args) === JSON.stringify(transaction.args);
  }

  removeTransaction(id) {
    delete this.activeTransactions[id];
  }

  secureHandler({ handlerObject, args }) {
    console.log('secureHandler', handlerObject, args);
    return this.secureWrapper({
      args,
      handlerObject,
      modifier: this.initTransaction(handlerObject.type, args),
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
  }) {
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
    });
  }
}

export default { ControllerModuleBase };
