import React from 'react';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { capitalize } from '@material-ui/core';

import UnknownIcon from '@assets/icons/unknown-icon.svg';

import GenericIcon from '../../../GenericIcon';
import ActivityItemDisplay from '../ActivityItemDisplay';
import ActivityItemDetails from '../ActivityItemDetails';

import { getSubtitle } from '../../utils';

const TokenItem = (props) => {
  const {
    type,
    to,
    from,
    amount,
    value,
    date,
    symbol,
    logo,
    canisterId,
    details,
    setOpenDetail,
    isTransaction,
    hovering,
    copied,
    onCopy,
    tooltipText,
  } = props;
  const { t } = useTranslation();

  return (
    <>
      <ActivityItemDisplay
        image={(
          <GenericIcon
            image={logo || UnknownIcon}
            type={type}
          />
          )}
        title={`${capitalize(type?.toLowerCase())} ${symbol ?? ''}`}
        subtitle={moment(date).format('MMM Do')}
        tooltip={getSubtitle(type, to, from, t, canisterId)}
        copied={copied}
        tooltipText={tooltipText}
        onCopy={onCopy}
      />
      <ActivityItemDetails
        main={<NumberFormat value={amount} displayType="text" thousandSeparator="," suffix={` ${symbol}`} decimalScale={5} />}
        secondary={<NumberFormat value={value} displayType="text" thousandSeparator="," prefix="$" suffix=" USD" decimalScale={2} />}
        hovering={hovering}
        details={details}
        setOpenDetail={setOpenDetail}
        isTransaction={isTransaction}
      />
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
  details: PropTypes.objectOf(PropTypes.string),
  to: PropTypes.string,
  from: PropTypes.string,
  amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  value: PropTypes.number,
  symbol: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  setOpenDetail: PropTypes.func.isRequired,
  isTransaction: PropTypes.bool.isRequired,
  hovering: PropTypes.bool,
  copied: PropTypes.bool.isRequired,
  onCopy: PropTypes.func.isRequired,
  tooltipText: PropTypes.string.isRequired,
};
