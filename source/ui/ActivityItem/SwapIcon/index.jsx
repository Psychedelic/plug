import React from 'react';
import SwapArrowImg from '@assets/icons/swap-arrow.svg';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { currencyPropTypes } from '@shared/constants/currencies';
import useStyles from './styles';

const SwapIcon = ({ fromCurrency, toCurrency, handleShowSwap }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img
        className={clsx(classes.image, classes.fromImage)}
        src={fromCurrency.image}
        alt={fromCurrency.name}
      />
      <img
        className={clsx(classes.image, classes.toImage)}
        src={toCurrency.image}
        alt={toCurrency.name}
        onMouseEnter={() => handleShowSwap(true)}
        onMouseLeave={() => handleShowSwap(false)}
      />
      <img
        className={classes.swapImage}
        src={SwapArrowImg}
        alt=""
      />
    </div>
  );
};

export default SwapIcon;

SwapIcon.propTypes = {
  fromCurrency: PropTypes.shape(currencyPropTypes).isRequired,
  toCurrency: PropTypes.shape(currencyPropTypes).isRequired,
  handleShowSwap: PropTypes.func.isRequired,
};
