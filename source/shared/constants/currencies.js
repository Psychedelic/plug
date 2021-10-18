import DfinityImg from '@assets/icons/Dfinity.svg';
import XTCImg from '@assets/icons/XTC.svg';
import PropTypes from 'prop-types';

export const USD_PER_TC = 1.426560;
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
};

export const currencyPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};
export const CYCLES_PER_TC = 1_000_000_000_000;

export const formatAssetBySymbol = (_amount, symbol, icpPrice) => {
  const amount = parseInt(_amount?.toString() || 0, 10);
  return ({
    ICP: {
      amount: amount / E8S_PER_ICP,
      value: (amount * icpPrice) / E8S_PER_ICP,
      image: TOKEN_IMAGES.ICP,
    },
    XTC: {
      amount: amount / CYCLES_PER_TC,
      value: (amount * USD_PER_TC) / CYCLES_PER_TC,
      image: TOKEN_IMAGES.XTC,
    },
    WTC: {
      amount: amount / CYCLES_PER_TC,
      value: (amount * USD_PER_TC) / CYCLES_PER_TC,
    },
    default: { amount, value: amount },
  })[symbol || 'default'] || { amount, value: amount };
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
};
