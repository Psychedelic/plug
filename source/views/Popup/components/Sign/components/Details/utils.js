import { capitalize } from '@shared/utils/string';
import { TOKENS } from '@shared/constants/currencies';
import { TRANSFER_METHOD_NAMES } from './constants';

const CYCLE_DECIMALS = 12;
const ICP_DECIMALS = 8;

// eslint-disable-next-line max-len
export const getAssetData = (canisterId) => Object.values(TOKENS).find((token) => token.canisterId === canisterId);

const DIP20_AMOUNT_MAP = {
  transfer: (args) => args?.[1] / (10 ** CYCLE_DECIMALS),
  transferErc20: (args) => args?.[1] / (10 ** CYCLE_DECIMALS),
  transferFrom: (args) => args?.[2] / (10 ** CYCLE_DECIMALS),

};

const ICP_AMOUNT_MAP = (args) => args?.[0]?.amount?.e8s / (10 ** ICP_DECIMALS);

// Get the amount of the token being transferred according to the standard
export const getAssetAmount = (request, standard) => {
  const { methodName } = request || {};
  const amountInArgs = {
    DIP20: DIP20_AMOUNT_MAP[methodName],
    XTC: DIP20_AMOUNT_MAP[methodName],
    WICP: DIP20_AMOUNT_MAP[methodName],
    ICP: ICP_AMOUNT_MAP,
    ROSETTA: ICP_AMOUNT_MAP,
  }[standard?.toUpperCase?.()];
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
