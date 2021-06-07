import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

const USDFormat = ({ value, ...other }) => (
  <NumberFormat value={value} displayType="text" thousandSeparator="," prefix="$" decimalScale={2} fixedDecimalScale {...other} />
);

export default USDFormat;

USDFormat.propTypes = {
  value: PropTypes.number.isRequired,
};
