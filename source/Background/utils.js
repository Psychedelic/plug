import { validateCanisterId, validatePrincipalId, validateAccountId } from '@shared/utils/ids';

import ERRORS from './errors';

const validateAmount = (amount) => !Number.isNaN(amount) && Number.isInteger(amount) && amount >= 0;
const isValidBigInt = (str) => {
  try {
    BigInt(str);
    return true;
  } catch (e) {
    return false;
  }
};
// eslint-disable-next-line
export const validateTransferArgs = ({ to, amount, opts }) => {
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

export const validateBurnArgs = ({ to, amount }) => {
  let message = null;

  if (!validateAmount(amount)) {
    message = 'The transaction failed because the amount entered was invalid. \n';
  }

  if (!validateCanisterId(to)) {
    message = 'The transaction failed because the destination address was invalid, it has to be a Canister ID';
  }
  return message ? ERRORS.CLIENT_ERROR(message) : null;
};

export const validateTransactions = (transactions) => Array.isArray(transactions)
  && transactions?.every(
    (tx) => tx.idl && tx.canisterId && tx.methodName && tx.args,
  );

/*
 * Return an array buffer from its hexadecimal representation.
 * @param hexString The hexadecimal string.
 */
export function fromHexToUint8Array(hexString) {
  return new Uint8Array(
    (hexString.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16)),
  );
}

/**
 * Returns an hexadecimal representation of an array buffer.
 * @param bytes The array buffer.
 */
export function fromUint8ArrayToHex(bytes) {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, '0'),
    '',
  );
}

/**
 * Return an array buffer from its hexadecimal representation.
 * @param hexString The hexadecimal string.
 */
export function fromHexToArrayBuffer(hexString) {
  return fromHexToUint8Array(hexString).buffer;
}

/**
 * Returns an hexadecimal representation of an array buffer.
 * @param bytes The array buffer.
 */
export function fromArrayBufferToHex(bytes) {
  return fromUint8ArrayToHex(new Uint8Array(bytes));
}
