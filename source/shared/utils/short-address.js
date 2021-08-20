import { validateAccountId } from './ids';

const defaultConfig = {
  leftSize: 5,
  rightSize: 3,
  separator: '...',
  replace: [],
};

const shortAddress = (address, config = defaultConfig) => {
  if (!address) return '';
  if (typeof address !== 'string') return '';

  let leftSize = config.leftSize || defaultConfig.leftSize;
  let rightSize = config.rightSize || defaultConfig.rightSize;
  if (validateAccountId(address)) {
    leftSize = 4;
    rightSize = 4;
  }

  if (address.length <= leftSize + rightSize) return address;

  const separator = config.separator || defaultConfig.separator;
  const replaceRules = config.replace || defaultConfig.replace;

  const addr = replaceRules.reduce(
    (acc, rules) => acc.replace(...rules),
    address,
  );

  return `${addr.slice(0, leftSize)}${separator}${addr.slice(rightSize * -1)}`;
};

export default shortAddress;
