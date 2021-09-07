export const PRINCIPAL_REGEX = /(\w{5}-){10}\w{3}/;
export const ALPHANUM_REGEX = /^[a-zA-Z0-9]+$/;
export const CANISTER_REGEX = /(\w{5}-){4}\w{3}/;
export const CANISTER_MAX_LENGTH = 27;

export const ADDRESS_TYPES = {
  PRINCIPAL: 'principal',
  ACCOUNT: 'accountId',
  CANISTER: 'canister',
};

export const DEFAULT_FEE = 0.00011; // Extra 0.00001 cause it seems to fluctuate somehow
export const XTC_FEE = 0.002;
