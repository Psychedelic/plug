import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SwapArrowImg from '@assets/icons/swap-arrow.svg';
import UnknownIcon from '@assets/icons/unknown-icon.svg';
import { currencyPropTypes } from '@shared/constants/currencies';
import TokenIcon from '../../../TokenIcon';

import useStyles from './styles';

const SwapIcon = ({
  fromCurrency, toCurrency, setHovering, hovering,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div
      className={classes.root}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <TokenIcon
        className={clsx(classes.image, classes.fromImage, hovering && classes.hovered)}
        logo={fromCurrency?.thumbnail || UnknownIcon}
        alt={fromCurrency?.name}
      />
      <img
        className={classes.swapImage}
        src={SwapArrowImg}
        alt={t('common.to')}
      />
      <TokenIcon
        className={clsx(classes.image, classes.toImage)}
        logo={toCurrency?.thumbnail || UnknownIcon}
        alt={toCurrency?.name}
      />
    </div>
  );
};

export default SwapIcon;

SwapIcon.propTypes = {
  fromCurrency: PropTypes.shape(currencyPropTypes).isRequired,
  toCurrency: PropTypes.shape(currencyPropTypes).isRequired,
  setHovering: PropTypes.func.isRequired,
  hovering: PropTypes.bool.isRequired,
};
