import { validateCanisterId, validatePrincipalId, validateAccountId } from '@shared/utils/ids';

import ERRORS from './errors';

const validateAmount = (amount) => Number.isNaN(amount) || !Number.isInteger(amount) || amount < 0;

// eslint-disable-next-line
export const validateTransferArgs = ({ to, amount }) => {
  let message = null;

  if (validateAmount(amount)) {
    message = 'The transaction failed because the amount entered was invalid. \n';
  }

  if (!validatePrincipalId(to) && !validateAccountId(to)) {
    message = 'The transaction failed because the destination address was invalid, it has to be a Principal ID or an Account ID.';
  }
  return message ? ERRORS.CLIENT_ERROR(message) : null;
};

export const validateBurnArgs = ({ to, amount }) => {
  let message = null;

  if (validateAmount(amount)) {
    message = 'The transaction failed because the amount entered was invalid. \n';
  }

  if (!validateCanisterId(to)) {
    message = 'The transaction failed because the destination address was invalid, it has to be a Canister ID';
  }
  return message ? ERRORS.CLIENT_ERROR(message) : null;
};
