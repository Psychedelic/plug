import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { ACTIVITY_TYPES, ACTIVITY_STATUS } from '@shared/constants/activity';
import { currencyPropTypes } from '@shared/constants/currencies';
import shortAddress from '@shared/utils/short-address';
import Typography from '@material-ui/core/Typography';

import GenericIcon from '../GenericIcon';
import SwapIcon from './SwapIcon';
import useStyles from './styles';

const getTitle = (type, currency, swapData, plug, t) => {
  switch (type) {
    case ACTIVITY_TYPES.SEND:
      return `${t('activity.title.send')} ${currency.name}`;
    case ACTIVITY_TYPES.RECEIVE:
      return `${t('activity.title.receive')} ${currency.name}`;
    case ACTIVITY_TYPES.SWAP:
      return `${t('activity.title.swap')} ${currency.name} ${t('activity.title.for')} ${swapData.currency.name}`;
    case ACTIVITY_TYPES.PLUG:
      return `${t('activity.title.pluggedInto')} ${plug.name}`;
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

const getSubtitle = (type, status, date, to, from, t) => {
  let subtitle = '';
  if (status === ACTIVITY_STATUS.COMPLETED) subtitle += moment(date).format('MMMM Do');
  if (type === ACTIVITY_TYPES.SEND) subtitle += ` · ${t('activity.subtitle.to')}: ${shortAddress(to)}`;
  if (type === ACTIVITY_TYPES.RECEIVE) subtitle += ` · ${t('activity.subtitle.from')}: ${shortAddress(from)}`;

  return subtitle;
};

const ActivityItem = ({
  type,
  currency,
  to,
  from,
  amount,
  value,
  status,
  date,
  plug,
  swapData,
  icon,
  name,
}) => {
  const { t } = useTranslation();
  const [showSwap, setShowSwap] = useState(false);

  const handleShowSwap = (show) => { setShowSwap(show); };

  const classes = useStyles();

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

  return (
    <div className={classes.root}>

      {
        type === ACTIVITY_TYPES.SWAP
          ? (
            <SwapIcon
              fromCurrency={currency}
              toCurrency={swapData.currency}
              handleShowSwap={handleShowSwap}
            />
          )
          : (
            <GenericIcon
              image={plug?.image || currency.image}
              type={type}
            />
          )
      }

      <div className={classes.leftContainer}>
        <Typography variant="h5">
          {getTitle(type, currency, swapData, plug, t)}
        </Typography>
        <Typography variant="subtitle2">
          {getStatus(status, classes, t)}{getSubtitle(type, status, date, to, from, t)}
        </Typography>
      </div>
      <div className={classes.rightContainer}>
        <Typography variant="h5">
          <NumberFormat value={showSwap ? swapData.amount : amount} displayType="text" thousandSeparator="," suffix={` ${showSwap ? swapData.currency.value : currency.value}`} decimalScale={5} />
        </Typography>
        <Typography variant="subtitle2">
          <NumberFormat value={showSwap ? swapData.value : value} displayType="text" thousandSeparator="," prefix="$" suffix=" USD" decimalScale={2} />
        </Typography>
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
  name: null,
  type: ACTIVITY_TYPES.PLUG,
};

ActivityItem.propTypes = {
  type: PropTypes.number,
  currency: PropTypes.shape(currencyPropTypes).isRequired,
  to: PropTypes.string,
  from: PropTypes.string,
  amount: PropTypes.number,
  value: PropTypes.number,
  status: PropTypes.number,
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
  name: PropTypes.string,
};
