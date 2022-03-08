import DfinityImg from '@assets/icons/Dfinity.svg';
import XTCImg from '@assets/icons/XTC.svg';
import WICPImg from '@assets/icons/WICP.png';
import PropTypes from 'prop-types';

export const AMOUNT_ERROR = 'Error';
export const USD_PER_TC = 1.42656;
export const E8S_PER_ICP = 100_000_000;
export const CURRENCIES = new Map([
  [
    'ICP',
    {
      id: 'ICP',
      name: 'ICP',
      value: 'ICP',
      symbol: 'ICP',
      image: DfinityImg,
    },
  ],
  [
    'XTC',
    {
      id: 'XTC',
      name: 'Cycles',
      value: 'XTC',
      image: XTCImg,
      symbol: 'XTC',
      price: USD_PER_TC,
    },
  ],
]);

export const TOKEN_IMAGES = {
  XTC: XTCImg,
  ICP: DfinityImg,
  WICP: WICPImg,
};

export const currencyPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};
export const CYCLES_PER_TC = 1_000_000_000_000;

export const formatAssetBySymbol = (_amount, symbol, icpPrice) => {
  const amount = Number.isNaN(_amount) ? AMOUNT_ERROR : parseFloat(_amount, 10);
  const icpValue = Number.isNaN(amount) ? AMOUNT_ERROR : amount * icpPrice;
  const tcValue = Number.isNaN(amount) ? AMOUNT_ERROR : amount * USD_PER_TC;

  return (
    {
      ICP: {
        amount,
        value: icpValue,
        image: TOKEN_IMAGES.ICP,
        symbol: 'ICP',
        decimals: 8,
      },
      XTC: {
        amount,
        value: tcValue,
        image: TOKEN_IMAGES.XTC,
        symbol: 'XTC',
        decimals: 12,
      },
      WTC: {
        amount,
        value: tcValue,
        symbol: 'WTC',
        decimals: 12,
      },
      WICP: {
        amount,
        value: icpValue,
        image: TOKEN_IMAGES.WICP,
        symbol: 'WICP',
        decimals: 8,
      },
      default: { amount },
    }[symbol || 'default'] || { amount }
  );
};

export const parseToAmount = (amount, decimals) => {
  let amountString = `${amount}`;
  let prefix = '';

  if (amountString[0] === '-') {
    prefix = '-';
    amountString = amountString.slice(1, amountString.length);
  }

  const difference = decimals - amountString.length;

  if (decimals >= amountString.length) {
    const formatedString = '0'.repeat(difference + 1) + amountString;

    return `${prefix + formatedString[0]}.${formatedString.slice(1, formatedString.length)}`;
  }

  return `${prefix + amountString.slice(0, Math.abs(difference))}.${amountString.slice(Math.abs(difference))}`;
};

export const parseFromAmount = (amount, decimals) => {
  let stringifiedAmount = `${amount}`;
  const shouldParseDecimalExponential = stringifiedAmount.search(/e-/);

  if (shouldParseDecimalExponential > -1) {
    const decimalsToAdd = stringifiedAmount.slice(shouldParseDecimalExponential + 2) - 1;
    const prefix = stringifiedAmount.slice(0, shouldParseDecimalExponential);
    stringifiedAmount = `0.${'0'.repeat(decimalsToAdd)}${prefix}`;
  }

  const commaIndex = stringifiedAmount.search(/[.]/);
  const decimalsToFill = decimals - (stringifiedAmount.length - commaIndex - 1);
  const strippedText = stringifiedAmount.slice(0, commaIndex) + stringifiedAmount.slice(commaIndex + 1) + '0'.repeat(decimalsToFill);
  const notZeroIndex = strippedText.search(/[^0]/);

  if (notZeroIndex > 1) {
    return strippedText.slice(notZeroIndex);
  }

  return strippedText;
};

export const parseAssetsAmount = (assets = []) => (
  assets.map((currentAsset) => {
    const { amount, token } = currentAsset;
    const { decimals } = token;

    const parsedAmount = parseToAmount(amount, decimals);

    return {
      ...currentAsset,
      amount: parsedAmount,
    };
  })
);

export const formatAssets = (assets = [], icpPrice) => {
  const mappedAssets = assets.map(({ amount, token }) => {
    const { name, symbol, canisterId } = token;
    const asset = formatAssetBySymbol(amount, symbol, icpPrice);
    return {
      ...asset,
      name,
      symbol,
      canisterId,
    };
  });
  return mappedAssets;
};

export const TOKENS = {
  ICP: {
    symbol: 'ICP',
    canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    name: 'ICP',
    decimals: 8,
    amount: 0,
    value: 0,
    image: TOKEN_IMAGES.ICP,
  },
  XTC: {
    symbol: 'XTC',
    canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
    name: 'Cycles',
    decimals: 12,
    amount: 0,
    value: 0,
    image: TOKEN_IMAGES.XTC,
  },
  WICP: {
    symbol: 'WICP',
    canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
    name: 'Wrapped ICP',
    decimals: 8,
    amount: 0,
    value: 0,
    image: TOKEN_IMAGES.WICP,
  },
};
