import React, { useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';

import { formatAssetBySymbol, parseToFloatAmount, TOKENS } from '@shared/constants/currencies';
import { useICPPrice } from '@redux/icp';

import SwapIcon from '../SwapIcon';
import ActivityItemDisplay from '../ActivityItemDisplay';
import ActivityItemDetails from '../ActivityItemDetails';

const getSwapData = (swap, iconHovered, icpPrice) => {
  const {
    from, to, amountIn, amountOut,
  } = swap || {};
  const inData = {
    amount: -parseToFloatAmount(
      amountIn, from?.details?.decimals || TOKENS[from?.details?.symbol]?.decimals,
    ),
    symbol: from?.details?.symbol,
  };
  const outData = {
    amount: parseToFloatAmount(
      amountOut, to?.details?.decimals || TOKENS[to?.details?.symbol]?.decimals,
    ),
    symbol: to?.details?.symbol,
  };
  const data = iconHovered ? inData : outData;
  return formatAssetBySymbol(data?.amount, data.symbol, icpPrice);
};

const SwapItem = ({
  date,
  details,
  setOpenDetail,
  hovering,
}) => {
  const { t } = useTranslation();
  const icpPrice = useICPPrice();
  const [iconHovered, setIconHovered] = useState(false);
  const { swap } = details?.sonicData || {};
  const data = getSwapData(swap, iconHovered, icpPrice);
  return (
    <>
      <ActivityItemDisplay
        image={(
          <SwapIcon
            fromCurrency={swap?.from}
            toCurrency={swap?.to}
            setHovering={setIconHovered}
            hovering={iconHovered}
          />
          )}
        title={`${t('activity.title.swap')} ${swap?.from?.name} ${t('activity.title.for')} ${swap?.to?.name || t('common.unknownToken')}`}
        subtitle={moment(date).format('MMM Do')}
      />
      <ActivityItemDetails
        main={<NumberFormat value={data.amount} displayType="text" thousandSeparator="," suffix={` ${data.symbol || ''}`} decimalScale={5} />}
        secondary={<NumberFormat value={data.value} displayType="text" thousandSeparator="," prefix="$" suffix=" USD" decimalScale={2} />}
        hovering={hovering}
        details={details}
        setOpenDetail={setOpenDetail}
      />
    </>
  );
};

export default SwapItem;

SwapItem.defaultProps = {
  details: null,
  hovering: false,
};

SwapItem.propTypes = {
  details: PropTypes.objectOf(PropTypes.string), // eslint-disable-line react/forbid-prop-types
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  setOpenDetail: PropTypes.func.isRequired,
  hovering: PropTypes.bool,
};
