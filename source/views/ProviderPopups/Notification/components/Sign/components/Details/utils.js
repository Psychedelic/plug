import { capitalize } from '@utils/string';
import { TOKENS } from '@constants/currencies';
import { TRANSFER_METHOD_NAMES } from './constants';

const CYCLE_DECIMALS = 12;
const ICP_DECIMALS = 8;

// eslint-disable-next-line max-len
export const getAssetData = (canisterId) => Object.values(TOKENS).find((token) => token.canisterId === canisterId);

// TODO: Do a request to DAB-JS to get the asset info and remove this hardcoding
export const getAssetAmount = (request) => {
  const { methodName } = request || {};
  const amountInArgs = {
    transfer: (args) => args?.[0]?.amount / (10 ** CYCLE_DECIMALS),
    transferErc20: (args) => args?.[1] / (10 ** CYCLE_DECIMALS),
    send_dfx: (args) => args?.[0]?.amount?.e8s / (10 ** ICP_DECIMALS),
  }[methodName];
  return amountInArgs(request?.decodedArguments);
};

/* eslint-disable no-nested-ternary */
// eslint-disable-next-line max-len
export const formatMethodName = (methodName, assetName) => {
  switch (methodName) {
    case 'swapExactTokensForTokens':
      return 'Swap Tokens';
    default:
      return TRANSFER_METHOD_NAMES.includes(methodName)
        ? `Transfer ${assetName ? `(${assetName})` : ''}`
        : methodName?.includes('_')
          ? methodName
            .split('_')
            .map((word) => capitalize(word))
            .join(' ')
          : capitalize(methodName);
  }
};
