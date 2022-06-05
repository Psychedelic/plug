import qs from 'query-string';
import extension from 'extensionizer';
import ERRORS from '@background/errors';
import SIZES from '../../Pages/Notification/components/Transfer/constants';

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
    }, (res) => {
      if (!res) {
        callback(ERRORS.SIZE_ERROR, null);
      }
    });
  }
}

export default { ControllerModuleBase };
