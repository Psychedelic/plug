import { Principal } from '@dfinity/agent';
import { ALPHANUM_REGEX, PRINCIPAL_REGEX } from './constants';

export const validatePrincipalId = (text) => {
  try {
    return PRINCIPAL_REGEX.test(text) && Principal.fromText(text);
  } catch (e) {
    return false;
  }
};

export const validateAccountId = (text) => text.length === 64 && ALPHANUM_REGEX.test(text);
