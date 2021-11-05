import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import extension from 'extensionizer';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowUpRight from '@assets/icons/arrow-up-right.png';
import { capitalize, IconButton } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';

import { ACTIVITY_STATUS } from '@shared/constants/activity';
import { currencyPropTypes } from '@shared/constants/currencies';
import shortAddress from '@shared/utils/short-address';
import Typography from '@material-ui/core/Typography';

import UnknownIcon from '@assets/icons/unknown-icon.svg';
import { getICRocksTransactionUrl } from '@shared/constants/urls';
import ReactJson from 'react-json-view';
import Dialog from '../Dialog';
import GenericIcon from '../GenericIcon';
import SwapIcon from './SwapIcon';
import useStyles from './styles';

const getTitle = (type, symbol, swapData, plug, t) => {
  switch (type) {
    case 'SEND':
    case 'RECEIVE':
      return `${capitalize(type?.toLowerCase())} ${symbol ?? ''}`;
    case 'SWAP':
      return `${t('activity.title.swap')} ${symbol} ${t('activity.title.for')} ${swapData.currency.name}`;
    case 'PLUG':
      return `${t('activity.title.pluggedInto')} ${plug.name}`;
    default:
      return `Executed: ${capitalize(type?.toLowerCase())} ${symbol ?? ''}`;
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

const getSubtitle = (type, to, from, t, canisterId) => (({
  SEND: ` · ${t('activity.subtitle.to')}: ${shortAddress(to)}`,
  BURN: ` · ${t('activity.subtitle.to')}: ${shortAddress(to)}`,
  RECEIVE: ` · ${t('activity.subtitle.from')}: ${shortAddress(from)}`,
})[type] ?? `. In: ${shortAddress(canisterId)}`);

const getAddress = (type, to, from, canisterId) => (
  {
    SEND: to,
    BURN: to,
    RECEIVE: from,
  }
)[type] || canisterId || '';

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
  canisterId,
  details,
}) => {
  const { t } = useTranslation();
  const [showSwap, setShowSwap] = useState(false);
  const [hover, setHover] = useState(false);
  const handleShowSwap = (show) => { setShowSwap(show); };
  const [openDetail, setOpenDetail] = useState(false);

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
  if (type === 'PLUG') {
    return (
      <div className={classes.root}>
        <img className={classes.image} src={icon} />
        <div className={classes.leftContainer}>
          <Typography variant="h5" className={classes.pluggedTitle}>
            {`${t('activity.title.pluggedInto')} ${name}`}
          </Typography>
          <Typography variant="subtitle2">
            {moment(Date.parse(date)).format('MMM Do')}
          </Typography>
        </div>
      </div>
    );
  }

  const isTransaction = ['SEND', 'RECEIVE'].includes(type) && symbol === 'ICP';
  return (
    <div
      className={clsx(classes.root, isTransaction && classes.pointer)}
      onClick={handleItemClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {
        type === 'SWAP'
          ? (
            <SwapIcon
              fromCurrency={{ symbol, value, amount }}
              toCurrency={swapData.currency}
              handleShowSwap={handleShowSwap}
            />
          )
          : (
            <GenericIcon
              image={plug?.image || image || UnknownIcon}
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
          {getStatus(status, classes, t)}{moment(date).format('MMM Do')}
          <Tooltip
            classes={{ tooltipPlacementBottom: classes.tooltip }}
            title={tooltipText}
            arrow
            open={showTooltip || copied}
            placement="bottom"
          >
            <span>{getSubtitle(type, to, from, t, canisterId)}</span>
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
            hover && classes.iconContainerAnimation,
          )
        }
        >
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
      {
        openDetail
        && (
          <Dialog
            title="Transaction Details"
            onClose={() => setOpenDetail(false)}
            open={openDetail}
            component={(
              <div className={classes.transactionDetailsContainer}>
                <ReactJson
                  src={details}
                  collapsed={2}
                  style={{
                    backgroundColor: '#F3F4F6',
                    padding: '10px',
                    borderRadius: '10px',
                    minHeight: '185px',
                    maxHeight: '350px',
                    overflow: 'auto',
                  }}
                />
              </div>
            )}
          />
        )
      }
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
  type: 'PLUG',
  hash: null,
  name: null,
  canisterId: null,
  details: null,
};

ActivityItem.propTypes = {
  type: PropTypes.number,
  canisterId: PropTypes.string,
  details: PropTypes.objectOf(PropTypes.any),
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
