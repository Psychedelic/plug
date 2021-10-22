import { capitalize } from '@shared/utils/string';
import { TOKENS } from '@shared/constants/currencies';
// eslint-disable-next-line max-len
export const getAssetData = (canisterId) => Object.values(TOKENS).find((token) => token.canisterId === canisterId);

export const getAssetAmount = (request) => {
  const { methodName } = request || {};
  const amountInArgs = {
    transfer: (args) => args?.[0]?.amount,
    transferErc20: (args) => args?.[1],
    send_dfx: (args) => args?.[0]?.amount,
  }[methodName];
  return amountInArgs(request?.decodedArguments);
};

export const formatMethodName = (methodName) => (methodName?.includes('_')
  ? methodName.split('_').map((word) => capitalize(word)).join(' ')
  : capitalize(methodName));
