import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

import { parseToFloatAmount, TOKENS } from '@shared/constants/currencies';

const TokenAmounts = ({ token0, token1 }) => {
  const parseTokenAmount = (token) => parseToFloatAmount(
    token?.amount, token?.token?.details?.decimals
    || TOKENS[token?.token?.details?.symbol]?.decimals,
  );
  const amount0 = parseTokenAmount(token0);
  const amount1 = parseTokenAmount(token1);
  // eslint-disable-next-line
  const NumberWithMin = ({ value, ...props }) => (value < 0.01 ? `<0.01${props.suffix}` : <NumberFormat {...props} value={value} />);
  return (
    <>
      <NumberWithMin
        value={amount0}
        displayType="text"
        thousandSeparator=","
        // eslint-disable-next-line react/prop-types
        suffix={` ${token0?.token?.details?.symbol}`}
        decimalScale={3}
      />
      +
      <NumberWithMin
        value={amount1}
        displayType="text"
        thousandSeparator=","
        // eslint-disable-next-line react/prop-types
        suffix={` ${token1?.token?.details?.symbol}`}
        decimalScale={3}
      />
    </>
  );
};

const TokenPropTypes = PropTypes.objectOf(PropTypes.shape({
  amount: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  token: PropTypes.shape({
    details: PropTypes.shape({
      symbol: PropTypes.string.isRequired,
      decimals: PropTypes.number.isRequired,
    }),
  }),
}));

TokenAmounts.propTypes = {
  token0: TokenPropTypes.isRequired,
  token1: TokenPropTypes.isRequired,
};

export default TokenAmounts;
