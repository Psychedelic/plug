import DfinityImg from '@assets/icons/Dfinity.svg';
import CyclesImg from '@assets/icons/Cycles.svg';
import PropTypes from 'prop-types';

export const CURRENCIES = {
  ICP: {
    name: 'ICP',
    value: 'ICP',
    displayName: 'Dfinity',
    image: DfinityImg,
  },
  CYCLES: {
    name: 'Cycles',
    value: 'T Cycles',
    displayName: 'Cycles',
    image: CyclesImg,
  },
};

export const currencyPropTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};
