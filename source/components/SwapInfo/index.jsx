import React from 'react';
import PropTypes from 'prop-types';
import DoubleArrowImg from '@assets/icons/double-arrow-right.svg';
import { currencyPropTypes } from '@shared/constants/currencies';

import useStyles from './styles';
import AssetInfo from './components/AssetInfo';

const SwapInfo = ({
  fromAsset, fromAmount, toAsset, toAmount,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AssetInfo asset={fromAsset} amount={fromAmount} classes={classes} />
      <img src={DoubleArrowImg} className={classes.arrows} />
      <AssetInfo asset={toAsset} amount={toAmount} classes={classes} />
    </div>
  );
};

export default SwapInfo;

SwapInfo.propTypes = {
  fromAsset: PropTypes.shape(currencyPropTypes).isRequired,
  fromAmount: PropTypes.number.isRequired,
  toAsset: PropTypes.shape(currencyPropTypes).isRequired,
  toAmount: PropTypes.number.isRequired,
};
