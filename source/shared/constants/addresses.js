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

export const getAssetFee = (selectedAsset) => {
  const { fee, decimals } = selectedAsset;

  const parsedFee = fee && decimals ? fee / 10 ** decimals : 0;

  return parsedFee;
};
