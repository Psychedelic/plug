import { Principal } from '@dfinity/agent';
import { ALPHANUM_REGEX, PRINCIPAL_REGEX } from '../constants/addresses';

export const validatePrincipalId = (text) => {
  try {
    const validRegex = PRINCIPAL_REGEX.test(text);
    const validPrincipal = text === Principal.fromText(text).toString();
    return validRegex && validPrincipal;
  } catch (e) {
    return false;
  }
};

export const validateAccountId = (text) => text.length === 64 && ALPHANUM_REGEX.test(text);
