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
    (tx) => tx.idl && tx.canisterId && tx.methodName && tx.args,
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
  if (!tokenIdentifier) return assets.filter((asset) => asset.canisterId === ICP_CANISTER_ID)[0];

  if (validateCanisterId(tokenIdentifier)) {
    return assets.filter((asset) => asset.canisterId === tokenIdentifier)[0];
  }

  return assets.filter((asset) => asset.symbol === tokenIdentifier)[0];
};
export const bufferToBase64 = (buf) => Buffer.from(buf).toString('base64');

export const base64ToBuffer = (base64) => Buffer.from(base64, 'base64');

export const handleCallRequest = async ({
  keyring, request, callId, portId, callback, redirected,
}) => {
  const arg = blobFromBuffer(base64ToBuffer(request.arguments));
  try {
    const signed = await keyring
      .getAgent().call(
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
  } catch (e) {
    callback(ERRORS.SERVER_ERROR(e), null, [{ portId, callId }]);
    if (redirected) callback(null, false);
  }
};

export const generateRequestInfo = (args) => {
  const decodedArguments = Object.values(recursiveParseBigint(
    PlugController.IDLDecode(blobFromBuffer(base64ToBuffer(args.arg))),
  ));
  return {
    canisterId: args.canisterId,
    methodName: args.methodName,
    sender: args.sender,
    arguments: args.arg,
    decodedArguments,
    type: 'call',
  };
};
