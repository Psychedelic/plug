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
      displayName: 'Dfinity',
      image: DfinityImg,
      price: 120,
    },
  ],
  [
    'CYCLES',
    {
      id: 'CYCLES',
      name: 'Cycles',
      value: 'T Cycles',
      displayName: 'Cycles',
      image: CyclesImg,
      price: 0.008,
    },
  ],
]);

export const currencyPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};
