import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

const AssetFormat = ({ value, asset, ...other }) => (
  <NumberFormat value={value} displayType="text" thousandSeparator="," suffix={` ${asset.value}`} decimalScale={2} fixedDecimalScale {...other} />
);

export default AssetFormat;

AssetFormat.propTypes = {
  value: PropTypes.number.isRequired,
  asset: PropTypes.objectOf(PropTypes.object).isRequired,
};
