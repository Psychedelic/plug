import React from 'react';
import NumberFormat from 'react-number-format';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import useStyles from './styles';

const AssetItem = ({
  image, name, amount, value, currency,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>

      <img className={classes.image} src={image} alt={name} />

      <div className={classes.leftContainer}>
        <span className={classes.title}>{name}</span>
        <span className={classes.amount}>{amount} {currency}</span>
      </div>

      <span className={clsx(classes.title, classes.value)}>
        <NumberFormat value={value} displayType="text" decimalScale={2} fixedDecimalScale thousandSeparator="," prefix="$" />
      </span>

    </div>
  );
};

export default AssetItem;

AssetItem.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
};
