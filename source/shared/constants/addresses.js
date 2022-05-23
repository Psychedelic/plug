export const PRINCIPAL_REGEX = /(\w{5}-){10}\w{3}/;
export const ALPHANUM_REGEX = /^[a-zA-Z0-9]+$/;
export const ICNS_REGEX = /^[a-zA-Z0-9-]{3,}\.icp$/;
export const CANISTER_REGEX = /(\w{5}-){4}\w{3}/;
export const CANISTER_MAX_LENGTH = 27;

export const ADDRESS_TYPES = {
  PRINCIPAL: 'principalId',
  ACCOUNT: 'accountId',
  CANISTER: 'canister',
  ICNS: 'icns',
};

export const DEFAULT_ICP_FEE = 0.0001;
export const XTC_FEE = 0.002;
export const OGY_FEE = 0.002;

// TODO: Serialize fee and decimals in assets and remove this.
export const getFee = (symbol) => ({
  ICP: DEFAULT_ICP_FEE,
  XTC: XTC_FEE,
  OGY: OGY_FEE,
}[symbol] || 0.0);
