import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import UnknownIcon from '@assets/icons/unknown-icon.svg';
import { currencyPropTypes } from '@shared/constants/currencies';
import TokenIcon from '../../../../../../TokenIcon';

import useStyles from './styles';

const LiquidityIcon = ({ token0, token1 }) => {
  const classes = useStyles();

  return (
    <div
      className={classes.root}
    >
      <TokenIcon
        className={clsx(classes.image, classes.fromImage)}
        logo={token0?.thumbnail || UnknownIcon}
        alt={token0?.name}
      />
      <TokenIcon
        className={clsx(classes.image, classes.toImage)}
        logo={token1?.thumbnail || UnknownIcon}
        alt={token1?.name}
      />
    </div>
  );
};

export default LiquidityIcon;

LiquidityIcon.propTypes = {
  token0: PropTypes.shape(currencyPropTypes).isRequired,
  token1: PropTypes.shape(currencyPropTypes).isRequired,
};
