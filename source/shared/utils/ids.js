import { Principal } from '@dfinity/principal';
import { ALPHANUM_REGEX, CANISTER_MAX_LENGTH } from '../constants/addresses';

export const validatePrincipalId = (text) => {
  try {
    return text === Principal.fromText(text).toString();
  } catch (e) {
    return false;
  }
};

export const validateAccountId = (text) => text.length === 64 && ALPHANUM_REGEX.test(text);

export const validateCanisterId = (text) => {
  try {
    return text.length <= CANISTER_MAX_LENGTH && validatePrincipalId(text);
  } catch (e) {
    return false;
  }
};
