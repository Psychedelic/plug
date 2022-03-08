import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  capitalize, IconButton, Typography,
} from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';

import ArrowUpRight from '@assets/icons/arrow-up-right.png';
import UnknownIcon from '@assets/icons/unknown-icon.svg';
import shortAddress from '@shared/utils/short-address';
import { GenericIcon } from '@ui';

import useStyles from '../../styles';
import ActivityItemDisplay from '../ActivityItemDisplay';

const getSubtitle = (type, to, from, t) => (({
  SEND: ` · ${t('activity.subtitle.to')}: ${shortAddress(to)}`,
  BURN: ` · ${t('activity.subtitle.to')}: ${shortAddress(to)}`,
  RECEIVE: ` · ${t('activity.subtitle.from')}: ${shortAddress(from)}`,
})[type]);

const getAddress = (type, to, from, canisterId) => (
  {
    SEND: to,
    BURN: to,
    RECEIVE: from,
  }
)[type] || canisterId || '';

const TokenItem = (props) => {
  const {
    type,
    to,
    from,
    amount,
    value,
    date,
    symbol,
    image,
    canisterId,
    details,
    setOpenDetail,
    isTransaction,
    hovering,
  } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  const [copied, setCopied] = useState(false);

  const copyText = t('copy.copyTextAddress');
  const copiedText = t('copy.copiedText');
  const [tooltipText, setTooltipText] = useState(copyText);

  const handleClickCopy = (e) => {
    e.stopPropagation();

    /* eslint-disable no-nested-ternary */
    navigator.clipboard.writeText(
      getAddress(type, to, from, canisterId),
    );

    setCopied(true);
    setTooltipText(copiedText);

    setTimeout(() => {
      setCopied(false);
    }, 1000);

    setTimeout(() => {
      setTooltipText(copyText);
    }, 1500);
  };
  return (
    <>
      <ActivityItemDisplay
        image={(
          <GenericIcon
            image={image || UnknownIcon}
            type={type}
          />
          )}
        title={`${capitalize(type?.toLowerCase())} ${symbol ?? ''}`}
        subtitle={moment(date).format('MMM Do')}
        tooltip={getSubtitle(type, to, from, t, canisterId)}
        copied={copied}
        tooltipText={tooltipText}
        onCopy={handleClickCopy}
      />
      <div className={classes.rightContainer}>
        <div className={classes.amountContainer}>
          <Typography variant="h5">
            <NumberFormat value={amount} displayType="text" thousandSeparator="," suffix={` ${symbol}`} decimalScale={5} />
          </Typography>
          <Typography variant="subtitle2">
            <NumberFormat value={value} displayType="text" thousandSeparator="," prefix="$" suffix=" USD" decimalScale={2} />
          </Typography>
        </div>
        <div className={clsx(classes.iconContainer, hovering && classes.iconContainerAnimation)}>
          {isTransaction ? (
            <img
              src={ArrowUpRight}
            />
          ) : details && (
            <IconButton size="small" onClick={() => setOpenDetail(true)} className={classes.detailsIcon}>
              <ListIcon />
            </IconButton>
          )}
        </div>
      </div>
    </>
  );
};

export default TokenItem;

TokenItem.defaultProps = {
  to: null,
  from: null,
  amount: null,
  value: null,
  type: 'PLUG',
  hovering: false,
  canisterId: null,
  details: null,
};

TokenItem.propTypes = {
  type: PropTypes.number,
  canisterId: PropTypes.string,
  details: PropTypes.objectOf(PropTypes.any),
  to: PropTypes.string,
  from: PropTypes.string,
  amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  value: PropTypes.number,
  symbol: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  setOpenDetail: PropTypes.func.isRequired,
  isTransaction: PropTypes.bool.isRequired,
  hovering: PropTypes.bool,
};
