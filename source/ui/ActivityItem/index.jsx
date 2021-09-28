import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import extension from 'extensionizer';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowUpRight from '@assets/icons/arrow-up-right.png';

import { ACTIVITY_TYPES, ACTIVITY_STATUS } from '@shared/constants/activity';
import { currencyPropTypes } from '@shared/constants/currencies';
import shortAddress from '@shared/utils/short-address';
import Typography from '@material-ui/core/Typography';

import { getICRocksTransactionUrl } from '@shared/constants/urls';
import GenericIcon from '../GenericIcon';
import SwapIcon from './SwapIcon';
import useStyles from './styles';

const getTitle = (type, symbol, swapData, plug, t) => {
  switch (type) {
    case ACTIVITY_TYPES.SEND:
      return `${t('activity.title.send')} ${symbol}`;
    case ACTIVITY_TYPES.RECEIVE:
      return `${t('activity.title.receive')} ${symbol}`;
    case ACTIVITY_TYPES.SWAP:
      return `${t('activity.title.swap')} ${symbol} ${t('activity.title.for')} ${swapData.currency.name}`;
    case ACTIVITY_TYPES.PLUG:
      return `${t('activity.title.pluggedInto')} ${plug.name}`;
    case ACTIVITY_TYPES.BURN:
      return `${t('activity.title.burn')} ${symbol}`;
    case ACTIVITY_TYPES.MINT:
      return `${t('activity.title.receive')} ${symbol}`;
    default:
      return '';
  }
};

const getStatus = (status, classes, t) => {
  switch (status) {
    case ACTIVITY_STATUS.PENDING:
      return <span className={classes.pending}>{t('activity.status.pending')}</span>;
    case ACTIVITY_STATUS.REVERTED:
      return <span className={classes.failed}>{t('activity.status.failed')}</span>;
    default:
      return null;
  }
};

const getDate = (status, date) => (
  status === ACTIVITY_STATUS.COMPLETED
    ? moment(date).format('MMMM Do')
    : ''
);

const getSubtitle = (type, to, from, t) => ({
  [ACTIVITY_TYPES.SEND]: ` · ${t('activity.subtitle.to')}: ${shortAddress(to)}`,
  [ACTIVITY_TYPES.RECEIVE]: ` · ${t('activity.subtitle.from')}: ${shortAddress(from)}`,
  [ACTIVITY_TYPES.BURN]: ` · ${t('activity.subtitle.to')}: ${shortAddress(to)}`,
})[type] || '';

const getAddress = (type, to, from) => (
  {
    [ACTIVITY_TYPES.SEND]: to,
    [ACTIVITY_TYPES.RECEIVE]: from,
    [ACTIVITY_TYPES.BURN]: to,
  }
)[type] || '';

const openICRocksTx = (hash) => {
  extension.tabs.create({ url: getICRocksTransactionUrl(hash) });
};

const ActivityItem = ({
  type,
  to,
  from,
  amount,
  value,
  status,
  date,
  plug,
  swapData,
  icon,
  symbol,
  hash,
  image,
  name,
}) => {
  const { t } = useTranslation();
  const [showSwap, setShowSwap] = useState(false);
  const [hover, setHover] = useState(false);
  const handleShowSwap = (show) => { setShowSwap(show); };

  const classes = useStyles();

  const [copied, setCopied] = useState(false);

  const copyText = t('copy.copyTextAddress');
  const copiedText = t('copy.copiedText');

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState(copyText);
  const handleItemClick = () => {
    if (symbol === 'ICP') {
      openICRocksTx(hash);
    }
  };

  const handleClickCopy = (e) => {
    e.stopPropagation();

    /* eslint-disable no-nested-ternary */
    navigator.clipboard.writeText(
      getAddress(type, to, from),
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

  if (type === ACTIVITY_TYPES.PLUG) {
    return (
      <div className={classes.root}>
        <img className={classes.image} src={icon} />
        <div className={classes.leftContainer}>
          <Typography variant="h5" className={classes.pluggedTitle}>
            {`${t('activity.title.pluggedInto')} ${name}`}
          </Typography>
          <Typography variant="subtitle2">
            {moment(Date.parse(date)).format('MMMM Do')}
          </Typography>
        </div>
      </div>
    );
  }

  const isTransaction = [ACTIVITY_TYPES.SEND, ACTIVITY_TYPES.RECEIVE].includes(type) && symbol === 'ICP';

  return (
    <div
      className={clsx(classes.root, isTransaction && classes.pointer)}
      onClick={handleItemClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {
        type === ACTIVITY_TYPES.SWAP
          ? (
            <SwapIcon
              fromCurrency={{ symbol, value, amount }}
              toCurrency={swapData.currency}
              handleShowSwap={handleShowSwap}
            />
          )
          : (
            <GenericIcon
              image={plug?.image || image}
              type={type}
            />
          )
      }
      <div className={classes.leftContainer}>
        <Typography variant="h5">
          {getTitle(type, symbol, swapData, plug, t)}
        </Typography>
        <Typography
          variant="subtitle2"
          onClick={handleClickCopy}
          onMouseOver={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {getStatus(status, classes, t)}{getDate(status, date)}
          <Tooltip
            classes={{ tooltipPlacementBottom: classes.tooltip }}
            title={tooltipText}
            arrow
            open={showTooltip || copied}
            placement="bottom"
          >
            <span>{getSubtitle(type, to, from, t)}</span>
          </Tooltip>
        </Typography>
      </div>
      <div className={classes.rightContainer}>
        <div className={classes.amountContainer}>
          <Typography variant="h5">
            <NumberFormat value={showSwap ? swapData.amount : amount} displayType="text" thousandSeparator="," suffix={` ${showSwap ? swapData.currency.name : symbol}`} decimalScale={5} />
          </Typography>
          <Typography variant="subtitle2">
            <NumberFormat value={showSwap ? swapData.value : value} displayType="text" thousandSeparator="," prefix="$" suffix=" USD" decimalScale={2} />
          </Typography>
        </div>
        <div className={
          clsx(
            classes.iconContainer,
            (isTransaction && hover) && classes.iconContainerAnimation,
          )
        }
        >
          <img
            src={ArrowUpRight}
          />
        </div>
      </div>

    </div>
  );
};

export default ActivityItem;

ActivityItem.defaultProps = {
  to: null,
  from: null,
  amount: null,
  value: null,
  status: null,
  plug: null,
  swapData: null,
  icon: null,
  type: ACTIVITY_TYPES.PLUG,
  hash: null,
  name: null,
};

ActivityItem.propTypes = {
  type: PropTypes.number,
  to: PropTypes.string,
  from: PropTypes.string,
  amount: PropTypes.number,
  value: PropTypes.number,
  status: PropTypes.number,
  symbol: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  plug: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }),
  swapData: PropTypes.shape({
    currency: PropTypes.shape(currencyPropTypes).isRequired,
    amount: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    status: PropTypes.oneOf(Object.keys(ACTIVITY_STATUS)).isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
  }),
  icon: PropTypes.string,
  hash: PropTypes.string,
  name: PropTypes.string,
};
