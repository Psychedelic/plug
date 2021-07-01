import DfinityImg from '@assets/icons/Dfinity.svg';
import CyclesImg from '@assets/icons/Cycles.svg';
import PropTypes from 'prop-types';

export const CURRENCIES = new Map([
  [
    'ICP',
    {
      id: 'ICP',
      name: 'ICP',
      value: 'ICP',
      image: DfinityImg,
      price: 120,
      disabled: false,
    },
  ],
  [
    'CYCLES',
    {
      id: 'CYCLES',
      name: 'Cycles',
      value: 'TC',
      image: CyclesImg,
      price: 0.6,
      disabled: true,
    },
  ],
]);

export const currencyPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};
