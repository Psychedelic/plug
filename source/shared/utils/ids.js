/* eslint-disable no-underscore-dangle */
import { Principal } from '@dfinity/principal';
import { ALPHANUM_REGEX, CANISTER_MAX_LENGTH, ICNS_REGEX } from '../constants/addresses';

export const isICNSName = (name) => ICNS_REGEX.test(name);

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

export const recursiveParsePrincipal = (data) => Object.entries(data).reduce((acum, [key, val]) => {
  const current = { ...acum };
  if (Array.isArray(val)) {
    current[key] = val.map((v) => recursiveParsePrincipal(v));
  } else if (val._isPrincipal) {
    current[key] = Principal.fromUint8Array(new Uint8Array(Object.values(val._arr))).toString();
  } else if (typeof val === 'object') {
    current[key] = recursiveParsePrincipal(val);
  } else {
    current[key] = val;
  }
  return current;
}, {});

export const validateAddress = (address) => validatePrincipalId(address)
  || validateAccountId(address);
