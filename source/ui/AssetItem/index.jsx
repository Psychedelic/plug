import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import useStyles from './styles';

const AssetItem = ({
  image, name, amount, value, symbol,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img className={classes.image} src={image} alt={name} />
      <div className={classes.leftContainer}>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="subtitle2">{amount} {symbol}</Typography>
      </div>
      <Typography variant="h5" className={classes.value}>
        <NumberFormat value={value} displayType="text" decimalScale={2} fixedDecimalScale thousandSeparator="," prefix="$" />
      </Typography>

    </div>
  );
};

export default AssetItem;

AssetItem.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
};
