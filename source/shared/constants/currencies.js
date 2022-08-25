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
      logo: DfinityImg,
    },
  ],
  [
    'XTC',
    {
      id: 'XTC',
      name: 'Cycles',
      value: 'XTC',
      logo: XTCImg,
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
  logo: PropTypes.string.isRequired,
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
        logo: TOKEN_IMAGES.ICP,
        symbol: 'ICP',
        decimals: 8,
      },
      XTC: {
        amount,
        value: tcValue,
        logo: TOKEN_IMAGES.XTC,
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
        logo: TOKEN_IMAGES.WICP,
        symbol: 'WICP',
        decimals: 8,
      },
      default: { amount },
    }[symbol || 'default'] || { amount }
  );
};

export const parseToFloatAmount = (amount, decimals) => {
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

/* Parse a string representing a floating point number to a strin representing a BigNumber. */
export const parseToBigIntString = (amount, decimalPlaces) => {
  if (amount < 10 ** -decimalPlaces) return '0';
  const amountString = `${amount}`.slice(0, decimalPlaces + 2);
  let decimalsToFill = 0;
  if (amountString.includes('e-')) {
    const [base, exponent] = amountString.split('e-');
    return parseToBigIntString(base, decimalPlaces - exponent);
  }
  const [main, decimals] = amountString.split('.');
  decimalsToFill = Math.max(decimalPlaces - Number(decimals?.length || 0), 0);
  const completeDecimals = (decimals || '') + '0'.repeat(decimalsToFill);
  return `${main}${completeDecimals}`;
};

export const parseAssetsAmount = (assets = []) => (
  assets.map((currentAsset) => {
    const { amount, token, error } = currentAsset;
    const hasError = error || amount === 'Error';
    const { decimals } = token;
    const parsedAmount = hasError
      ? 0
      : parseToFloatAmount(amount, parseInt(decimals?.toString(), 10));

    return {
      ...currentAsset,
      amount: parsedAmount,
      error: hasError,
    };
  })
);

export const formatAssets = (assets = [], icpPrice) => {
  const mappedAssets = assets.map(({ amount, token, error }) => {
    const asset = formatAssetBySymbol(amount, token.symbol, icpPrice);
    return {
      ...token,
      ...asset,
      error,
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
    logo: TOKEN_IMAGES.ICP,
    standard: 'ROSETTA',
  },
  XTC: {
    symbol: 'XTC',
    canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
    name: 'Cycles',
    decimals: 12,
    amount: 0,
    value: 0,
    logo: TOKEN_IMAGES.XTC,
    standard: 'DIP20',
  },
  WICP: {
    symbol: 'WICP',
    canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
    name: 'Wrapped ICP',
    decimals: 8,
    amount: 0,
    value: 0,
    logo: TOKEN_IMAGES.WICP,
    standard: 'DIP20',
  },
};
