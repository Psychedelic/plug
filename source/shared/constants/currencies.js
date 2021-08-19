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
