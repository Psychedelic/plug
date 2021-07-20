import { validatePrincipalId, validateAccountId } from '@shared/utils/ids';

// eslint-disable-next-line
export const validateTransferArgs = ({ to, amount }) => {
  let message = null;
  if (Number.isNaN(amount) || !Number.isInteger(amount) || amount < 0) {
    message = 'Invalid amount. The amount must be a positive integer. \n';
  }
  if (!validatePrincipalId(to) && !validateAccountId(to)) {
    message = 'Invalid to address. The address must be a principal Id or an account Id';
  }
  return message ? { code: 400, message } : null;
};
