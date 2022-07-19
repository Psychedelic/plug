import CycleWalletImg from '@assets/icons/cycle-wallet.svg';
import PlugAccountImg from '@assets/icons/plug.svg';
import PropTypes from 'prop-types';

export const SOURCES = new Map([
  [
    'PLUG_ACCOUNT',
    {
      id: 'PLUG_ACCOUNT',
      name: 'Plug Account',
      image: PlugAccountImg,
    },
  ],
  [
    'CYCLE_WALLET',
    {
      id: 'CYCLE_WALLET',
      name: 'Canister / Cycle Wallet',
      image: CycleWalletImg,
    },
  ],
]);

export const sourcePropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};
