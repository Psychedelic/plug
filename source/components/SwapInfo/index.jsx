import React from 'react';
import PropTypes from 'prop-types';
import DoubleArrowImg from '@assets/icons/double-arrow-right.svg';
import { Typography } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { currencyPropTypes } from '@shared/constants/currencies';
import useStyles from './styles';

const AssetInfo = ({ asset, amount, classes }) => (
  <div className={classes.assetInfo}>
    <img src={asset.image} className={classes.icon} />
    <Typography variant="h3" className={classes.asset}>
      <NumberFormat value={amount} displayType="text" thousandSeparator="," suffix={` ${asset.value}`} />
    </Typography>
    <Typography variant="subtitle2">
      <NumberFormat value={amount * asset.price} displayType="text" thousandSeparator="," prefix="$" />
    </Typography>
  </div>
);

const SwapInfo = ({
  fromAsset, fromAmount, toAsset, toAmount,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AssetInfo asset={fromAsset} amount={fromAmount} classes={classes} />
      <img src={DoubleArrowImg} />
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

AssetInfo.propTypes = {
  asset: PropTypes.shape(currencyPropTypes).isRequired,
  amount: PropTypes.number.isRequired,
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
};
