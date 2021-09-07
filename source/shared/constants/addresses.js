export const PRINCIPAL_REGEX = /(\w{5}-){10}\w{3}/;
export const ALPHANUM_REGEX = /^[a-zA-Z0-9]+$/;
export const CANISTER_REGEX = /(\w{5}-){4}\w{3}/;
export const CANISTER_MAX_LENGTH = 27;

export const ADDRESS_TYPES = {
  PRINCIPAL: 'principal',
  ACCOUNT: 'accountId',
  CANISTER: 'canister',
};

export const DEFAULT_FEE = 0.0001;
export const BURN_FEE = 0.0;
