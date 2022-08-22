/* eslint-disable no-console */
import PlugController from '@psychedelic/plug-controller';

import { validateCanisterId, validatePrincipalId, validateAccountId } from '@shared/utils/ids';
import { getDabNfts, getDabTokens } from '@shared/services/DAB';
import { ASSET_CANISTER_IDS, ICP_CANISTER_ID } from '@shared/constants/canisters';
import { CYCLES_PER_TC } from '@shared/constants/currencies';
import { XTC_FEE } from '@shared/constants/addresses';
import { setProtectedIds } from '@modules/storageManager';
import { Principal } from '@dfinity/principal';
import { blobFromBuffer, blobToUint8Array } from '@dfinity/candid';

import ERRORS from './errors';
import { recursiveParseBigint } from './Keyring';

const validateAmount = (amount) => !Number.isNaN(amount) && Number.isInteger(amount) && amount >= 0;
const validateFloatStrAmount = (amount) => !Number.isNaN(parseFloat(amount))
  && parseFloat(amount) >= 0;

const isValidBigInt = (str) => {
  try {
    BigInt(str);
    return true;
  } catch (e) {
    return false;
  }
};
// eslint-disable-next-line
export const validateTransferArgs = ({ to, amount, opts, strAmount }) => {
  let message = null;

  if (amount && !validateAmount(amount)) {
    message = 'The transaction failed because the amount entered was invalid. \n';
  }

  if (strAmount && !validateFloatStrAmount(strAmount)) {
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

export const validateBurnArgs = ({ to, amount }) => {
  let message = null;

  if (!validateAmount(amount)) {
    message = 'The transaction failed because the amount entered was invalid. \n';
  }

  if (!validateCanisterId(to)) {
    message = 'The transaction failed because the destination address was invalid, it has to be a Canister ID';
  }
  if (amount < XTC_FEE * CYCLES_PER_TC) {
    message = 'You cannot burn less XTC than the minimum fee';
  }
  return message ? ERRORS.CLIENT_ERROR(message) : null;
};

export const validateTransactions = (transactions) => Array.isArray(transactions)
  && transactions?.every(
    (tx) => tx.sender && tx.canisterId && tx.methodName,
  );

export const initializeProtectedIds = async () => {
  const nftCanisters = await getDabNfts();
  const tokenCanisters = await getDabTokens();
  const PROTECTED_IDS = [
    ...(nftCanisters || []).map((collection) => collection.principal_id.toString()),
    ...(tokenCanisters || []).map((token) => token.principal_id.toString()),
    ...ASSET_CANISTER_IDS,
  ];
  setProtectedIds(PROTECTED_IDS);
};

export const fetchCanistersInfo = async (whitelist) => {
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

// TokenIdentifier is SYMBOL or  CanisterID
// Return ICP by default
export const getToken = (tokenIdentifier, assets) => {
  if (!tokenIdentifier) return assets.find((asset) => asset.canisterId === ICP_CANISTER_ID);

  if (validateCanisterId(tokenIdentifier)) {
    return assets.find((asset) => asset.canisterId === tokenIdentifier);
  }

  return assets.find((asset) => asset.symbol === tokenIdentifier);
};
export const bufferToBase64 = (buf) => Buffer.from(buf).toString('base64');

export const base64ToBuffer = (base64) => Buffer.from(base64, 'base64');

export const isDeepEqualObject = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

export const validateBatchTx = (savedTxInfo, canisterId, methodName, arg) => {
  if (!savedTxInfo
    || savedTxInfo.canisterId !== canisterId
    || savedTxInfo.methodName !== methodName) {
    // if you dont have savedTxInfo
    // or the methodName or cannotisterId is different from the savedTxInfo
    // the batch tx is not valid
    return false;
  }

  if (savedTxInfo.args) {
    // if there is args saved in the savedTxInfo
    // coming args must be the same as the saved args
    // args and savedTxInfo.args gonna be base64 encoded
    return savedTxInfo.args === arg;
  }

  return true;
};

export const handleCallRequest = async ({
  keyring, request, callId, portId, callback, redirected, host,
}) => {
  const arg = blobFromBuffer(base64ToBuffer(request.arguments));
  try {
    if (request.batchTxId && request.batchTxId.lenght !== 0 && !request.savedBatchTrx) {
      callback(ERRORS.NOT_VALID_BATCH_TRANSACTION, null, [{ portId, callId }]);
      if (redirected) callback(null, false);
      return false;
    }
    if (request.savedBatchTrx) {
      const validate = validateBatchTx(
        request.savedBatchTrx,
        request.canisterId,
        request.methodName,
        request.arguments,
      );
      if (!validate) {
        callback(ERRORS.NOT_VALID_BATCH_TRANSACTION, null, [{ portId, callId }]);
        if (redirected) callback(null, false);
        return false;
      }
    }
    const agent = await keyring.getAgent({ host });
    const signed = await agent.call(
      Principal.fromText(request.canisterId),
      {
        methodName: request.methodName,
        arg,
      },
    );
    callback(null, {
      ...signed,
      requestId: bufferToBase64(blobToUint8Array(signed.requestId)),
    }, [
      { callId, portId },
    ]);
    if (redirected) callback(null, true);
    return true;
  } catch (e) {
    console.warn('Error when executing update transaction', e);
    callback(ERRORS.SERVER_ERROR(e), null, [{ portId, callId }]);
    if (redirected) callback(null, false);
    return false;
  }
};

const getLeafValues = (data, values = []) => {
  if (!data) return [...values, data];
  if (typeof data !== 'object') {
    return [data];
  }
  return [...values, ...Object.values(data).flatMap((v) => getLeafValues(v, values))];
};

const doObjectValuesMatch = (obj1 = {}, obj2 = {}) => {
  const leafValues1 = getLeafValues(obj1) || [];
  const leafValues2 = getLeafValues(obj2) || [];
  return leafValues1.every((v) => leafValues2.includes(v));
};

export const generateRequestInfo = (args, preDecodedArgs) => {
  const decodedArguments = recursiveParseBigint(
    PlugController.IDLDecode(blobFromBuffer(base64ToBuffer(args.arg))),
  );
  // TODO: Check if it's possible to decode keys in arguments
  const shouldWarn = !doObjectValuesMatch(preDecodedArgs, decodedArguments);
  return {
    canisterId: args.canisterId,
    methodName: args.methodName,
    sender: args.sender,
    arguments: args.arg,
    decodedArguments: preDecodedArgs || decodedArguments,
    type: 'call',
    shouldWarn,
  };
};

export const lebEncodeArgs = (args) => {
  if (!Array.isArray(args) || args.length() === 0) {
    return undefined;
  }
  return PlugController.IDLEncode(args);
};
