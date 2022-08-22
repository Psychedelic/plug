import React from 'react';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import PropTypes from 'prop-types';
import { capitalize } from '@material-ui/core';

import ActivityItemDisplay from '../../ActivityItemDisplay';
import ActivityItemDetails from '../../ActivityItemDetails';
import LiquidityIcon from './components/LiquidityIcon';
import TokenAmounts from './components/TokenAmounts';

const LP_DECIMALS = 8;

const LiquidityItem = (props) => {
  const {
    type,
    date,
    details,
    setOpenDetail,
    isTransaction,
    hovering,
    copied,
    onCopy,
    tooltipText,
  } = props;
  const title = capitalize(`${type?.toLowerCase()?.replace('liquidity', ' Liquidity')}`);
  const { token0, token1 } = details?.sonicData?.liquidity || {};
  return (
    <>
      <ActivityItemDisplay
        image={(
          <LiquidityIcon
            token0={token0?.token}
            token1={token1?.token}
          />
          )}
        title={title}
        subtitle={moment(date).format('MMM Do')}
        copied={copied}
        tooltipText={tooltipText}
        onCopy={onCopy}
      />
      <ActivityItemDetails
        main={<TokenAmounts token0={token0} token1={token1} />}
        secondary={<NumberFormat value={details?.lpAmount / 10 ** LP_DECIMALS} displayType="text" thousandSeparator="," suffix=" LP" decimalScale={2} />}
        hovering={hovering}
        details={details}
        setOpenDetail={setOpenDetail}
        isTransaction={isTransaction}
      />
    </>
  );
};

export default LiquidityItem;

LiquidityItem.defaultProps = {
  type: 'PLUG',
  hovering: false,
  details: null,
};

LiquidityItem.propTypes = {
  type: PropTypes.number,
  details: PropTypes.objectOf(PropTypes.string),
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
