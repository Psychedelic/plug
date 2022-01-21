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
  const amount = parseFloat(_amount, 10) || AMOUNT_ERROR;

  return (
    {
      ICP: {
        amount,
        value: amount * icpPrice || AMOUNT_ERROR,
        image: TOKEN_IMAGES.ICP,
        symbol: 'ICP',
      },
      XTC: {
        amount,
        value: amount * USD_PER_TC || AMOUNT_ERROR,
        image: TOKEN_IMAGES.XTC,
        symbol: 'XTC',
      },
      WTC: {
        amount,
        value: amount * USD_PER_TC || AMOUNT_ERROR,
        symbol: 'WTC',
      },
      WICP: {
        amount,
        value: amount * icpPrice || AMOUNT_ERROR,
        image: TOKEN_IMAGES.WICP,
        symbol: 'WICP',
      },
      default: { amount },
    }[symbol || 'default'] || { amount }
  );
};

export const formatAssets = (assets = [], icpPrice) => {
  const mappedAssets = assets.map(({
    amount, name, symbol, canisterId,
  }) => {
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
    decimals: 5,
    amount: 0,
    value: 0,
    image: TOKEN_IMAGES.ICP,
  },
  XTC: {
    symbol: 'XTC',
    canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
    name: 'Cycles',
    decimals: 5,
    amount: 0,
    value: 0,
    image: TOKEN_IMAGES.XTC,
  },
  WICP: {
    symbol: 'WICP',
    canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
    name: 'Wrapped ICP',
    decimals: 5,
    amount: 0,
    value: 0,
    image: TOKEN_IMAGES.WICP,
  },
};
