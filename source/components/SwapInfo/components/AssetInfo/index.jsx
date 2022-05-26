import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Typography } from '@material-ui/core';

import { currencyPropTypes } from '@shared/constants/currencies';
import TokenIcon from '@components/TokenIcon';

const AssetInfo = ({ asset, amount, classes }) => (
  <div className={classes.assetInfo}>
    <TokenIcon image={asset.image} className={classes.icon} symbol={asset?.symbol} />
    <Typography variant="h3" className={classes.asset}>
      <NumberFormat value={amount} displayType="text" thousandSeparator="," suffix={` ${asset.value}`} />
    </Typography>
    <Typography variant="subtitle2">
      <NumberFormat value={amount * asset.price} displayType="text" thousandSeparator="," prefix="$" />
    </Typography>
  </div>
);
AssetInfo.propTypes = {
  asset: PropTypes.shape(currencyPropTypes).isRequired,
  amount: PropTypes.number.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};
