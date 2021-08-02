import { Principal } from '@dfinity/agent';
import { ALPHANUM_REGEX } from '../constants/addresses';

export const validatePrincipalId = (text) => {
  try {
    return text === Principal.fromText(text).toString();
  } catch (e) {
    return false;
  }
};

export const validateAccountId = (text) => text.length === 64 && ALPHANUM_REGEX.test(text);
