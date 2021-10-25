import { capitalize } from '@shared/utils/string';
import { TOKENS } from '@shared/constants/currencies';
import { TRANSFER_METHOD_NAMES } from './constants';
// eslint-disable-next-line max-len
export const getAssetData = (canisterId) => Object.values(TOKENS).find((token) => token.canisterId === canisterId);

export const getAssetAmount = (request) => {
  const { methodName } = request || {};
  const amountInArgs = {
    transfer: (args) => args?.[0]?.amount,
    transferErc20: (args) => args?.[1],
    send_dfx: (args) => args?.[0]?.amount?.e8s,
  }[methodName];
  return amountInArgs(request?.decodedArguments);
};

/* eslint-disable no-nested-ternary */
// eslint-disable-next-line max-len
export const formatMethodName = (methodName, assetName) => (TRANSFER_METHOD_NAMES.includes(methodName)
  ? `Transfer ${assetName ? `(${assetName})` : ''}`
  : (methodName?.includes('_')
    ? methodName.split('_').map((word) => capitalize(word)).join(' ')
    : capitalize(methodName)));
