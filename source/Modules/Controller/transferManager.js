import { getApp } from '../storageManager';
import fromExponential from 'from-exponential';
import { createWindow } from '../popupManager';
import ERRORS from '../../Background/errors';
import { DEFAULT_CURRENCY_MAP } from './constants';
import {
  getOptsData,
  handleError,
  handleSuccess,
} from './utils';
import {
  getKeyringHandler,
  HANDLER_TYPES,
  getKeyringErrorMessage,
} from '../../Background/Keyring';

// Utils
const validateTransferArgs = ({ to, amount, opts }) => {
  let message = null;

  if (!validateAmount(amount)) {
    message = 'The transaction failed because the amount entered was invalid. \n';
  }

  if (!validatePrincipalId(to) && !validateAccountId(to)) {
    message = 'The transaction failed because the destination address was invalid, it has to be a Principal ID or an Account ID.';
  }
  if (opts?.memo && !isValidBigInt(opts?.memo)) {
    message = 'The transaction failed because the memo entered was invalid. It needs to be a valid BigInt \n';
  }
  return message ? ERRORS.CLIENT_ERROR(message) : null;
};

// Export functions
export const requestTransfer = async (secureController, opts, metadata, args, keyring) => (
  secureController(opts.callback, async () => {
    const { callId, portId, callback } = getOptsData(opts);

    getApp(keyring.currentWalletId.toString(), metadata?.url, (app) => {
      if (app?.status !== CONNECTION_STATUS.accepted) {
        callback(ERRORS.CONNECTION_ERROR, null);
        return;
      }

      const argsError = validateTransferArgs(args);
      if (argsError) {
        callback(argsError, null);
        return;
      }

      const notificationData = {
        type: 'tranfer',
        metadata,
        app,
        args,
        opts,
      };

      createWindow({
        notificationData,
        keyring,
      });
    });
  })
);

export const handleRequestTransfer = async (secureController, opts, transferRequests, callId, portId, keyring) => (
  secureController(opts.callback, async () => {
    const { callback } = opts;
    const transfer = transferRequests?.[0];

    // Reject transaction if declined
    if (transfer?.status === 'declined') {
      handleError({
        value: true,
        callback,
        error: ERRORS.TRANSACTION_REJECTED,
        portId,
        callId,
      });

      return;
    } 

    const getBalance = getKeyringHandler(HANDLER_TYPES.GET_BALANCE, keyring);
    const sendToken = getKeyringHandler(HANDLER_TYPES.SEND_TOKEN, keyring);

    const assets = await getBalance();
    const parsedAmount = (transfer.amount / E8S_PER_ICP);

    // Reject transaction if not enough balance
    if (assets?.[DEFAULT_CURRENCY_MAP.ICP]?.amount <= parsedAmount) {
      handleError({
        callback,
        error: ERRORS.BALANCE_ERROR,
        portId,
        callId
      });

      return;
    };

    transfer.amount = fromExponential(parsedAmount);
    const response = await sendToken(transfer);

    // Handle sendToken error
    if (response.error) {
      handleError({
        callback,
        error: ERRORS.SERVER_ERROR(response.error),
        portId,
        callId,
      });

      return;
    } 

    handleSuccess({
      callback,
      response,
      portId,
      callId,
    });
  })
);
