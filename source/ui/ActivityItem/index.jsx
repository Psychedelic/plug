import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import { ACTIVITY_TYPES, ACTIVITY_STATUS } from '@shared/constants/activity';
import { currencyPropTypes } from '@shared/constants/currencies';
import PropTypes from 'prop-types';
import GenericIcon from '../GenericIcon';
import SwapIcon from './SwapIcon';
import useStyles from './styles';

const getTitle = (type, currency, swapData, plug) => {
  switch (type) {
    case ACTIVITY_TYPES.SEND:
      return `Send ${currency.name}`;
    case ACTIVITY_TYPES.RECEIVE:
      return `Receive ${currency.name}`;
    case ACTIVITY_TYPES.SWAP:
      return `Swap ${currency.name} for ${swapData.currency.name}`;
    case ACTIVITY_TYPES.PLUG:
      return `Plugged into ${plug.name}`;
    default:
      return '';
  }
};

const getStatus = (status, classes) => {
  switch (status) {
    case ACTIVITY_STATUS.PENDING:
      return <span className={classes.pending}>Pending</span>;
    case ACTIVITY_STATUS.FAILED:
      return <span className={classes.failed}>Failed</span>;
    default:
      return null;
  }
};

const getSubtitle = (type, status, date, wallet) => {
  let subtitle = '';

  if (status === ACTIVITY_STATUS.DONE) subtitle += date;

  if (type === ACTIVITY_TYPES.SEND) subtitle += ` · To: ${wallet}`;

  if (type === ACTIVITY_TYPES.RECEIVE) subtitle += ` · From: ${wallet}`;

  return subtitle;
};

const ActivityItem = ({
  type,
  currency,
  wallet,
  amount,
  value,
  status,
  date,
  plug,
  swapData,
}) => {
  const [showSwap, setShowSwap] = useState(false);

  const handleShowSwap = (show) => { setShowSwap(show); };

  const classes = useStyles();

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
        <span className={classes.title}>
          {getTitle(type, currency, swapData, plug)}
        </span>
        <span className={classes.subtitle}>
          {getStatus(status, classes)}{getSubtitle(type, status, date, wallet)}
        </span>
      </div>

      {
        type !== ACTIVITY_TYPES.PLUG
        && (
          <div className={classes.rightContainer}>
            <span className={classes.title}>
              <NumberFormat value={showSwap ? swapData.amount : amount} displayType="text" thousandSeparator="," suffix={` ${showSwap ? swapData.currency.value : currency.value}`} />
            </span>
            <span className={classes.subtitle}>
              <NumberFormat value={showSwap ? swapData.value : value} displayType="text" thousandSeparator="," prefix="$" suffix=" USD" />
            </span>
          </div>
        )
      }

    </div>
  );
};

export default ActivityItem;

ActivityItem.defaultProps = {
  wallet: null,
  amount: null,
  value: null,
  status: null,
  plug: null,
  swapData: null,
};

ActivityItem.propTypes = {
  type: PropTypes.number.isRequired,
  currency: PropTypes.shape(currencyPropTypes).isRequired,
  wallet: PropTypes.string,
  amount: PropTypes.number,
  value: PropTypes.number,
  status: PropTypes.number,
  date: PropTypes.string.isRequired,
  plug: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }),
  swapData: PropTypes.shape({
    currency: PropTypes.shape(currencyPropTypes).isRequired,
    amount: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    status: PropTypes.oneOf(Object.keys(ACTIVITY_STATUS)).isRequired,
    date: PropTypes.string.isRequired,
  }),
};
