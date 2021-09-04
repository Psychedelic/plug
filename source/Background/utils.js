import { validateCanisterId, validatePrincipalId, validateAccountId } from '@shared/utils/ids';

import ERRORS from './errors';

const validateAmount = (amount) => {
  if (Number.isNaN(amount) || !Number.isInteger(amount) || amount < 0) {
    return 'Invalid amount. The amount must be a positive integer. \n';
  }

  return false;
};

// eslint-disable-next-line
export const validateTransferArgs = ({ to, amount }) => {
  let message = null;
  message = validateAmount(amount);
  /*
  if (Number.isNaN(amount) || !Number.isInteger(amount) || amount < 0) {
    message = 'Invalid amount. The amount must be a positive integer. \n';
  }
  */
  if (!validatePrincipalId(to) && !validateAccountId(to)) {
    message = 'Invalid to address. The address must be a principal Id or an account Id';
  }
  return message ? ERRORS.CLIENT_ERROR(message) : null;
};

export const validateBurnArgs = ({ to, amount }) => {
  let message = null;
  message = validateAmount(amount);

  if (!validateCanisterId(to)) {
    message = 'Invalid to address. The address must be a canister Id';
  }
  return message ? ERRORS.CLIENT_ERROR(message) : null;
};
