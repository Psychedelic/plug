import { validateCanisterId, validatePrincipalId, validateAccountId } from '@shared/utils/ids';
import { XTC_FEE } from '@shared/constants/addresses';
import { CYCLES_PER_TC } from '@shared/constants/currencies';

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
  if (amount < XTC_FEE * CYCLES_PER_TC) {
    message = 'You cannot burn less XTC than the minimum fee';
  }
  return message ? ERRORS.CLIENT_ERROR(message) : null;
};

export const validateTransactions = (transactions) => Array.isArray(transactions)
  && transactions?.every(
    (tx) => tx.idl && tx.canisterId && tx.methodName && tx.args,
  );
