import React, { useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';

import { formatAssetBySymbol, parseToFloatAmount } from '@shared/constants/currencies';
import { useICPPrice } from '@redux/icp';

import SwapIcon from '../SwapIcon';
import ActivityItemDisplay from '../ActivityItemDisplay';
import ActivityItemDetails from '../ActivityItemDetails';

const getSwapData = (swap, iconHovered, icpPrice) => {
  const {
    from, to, amountIn, amountOut,
  } = swap || {};
  const inData = {
    amount: -parseToFloatAmount(amountIn, from?.details?.decimals),
    symbol: from?.details?.symbol,
  };
  const outData = {
    amount: parseToFloatAmount(amountOut, to?.details?.decimals),
    symbol: to?.details?.symbol,
  };
  const data = iconHovered ? outData : inData;
  return formatAssetBySymbol(data?.amount, data.symbol, icpPrice);
};

const TokenItem = ({
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
          <SwapIcon fromCurrency={swap?.from} toCurrency={swap?.to} setHovering={setIconHovered} />
          )}
        title={`${t('activity.title.swap')} ${swap?.from?.name} ${t('activity.title.for')} ${swap?.to?.name || t('common.unknownToken')}`}
        subtitle={moment(date).format('MMM Do')}
      />
      <ActivityItemDetails
        main={<NumberFormat value={data.amount} displayType="text" thousandSeparator="," suffix={` ${data.symbol}`} decimalScale={5} />}
        secondary={<NumberFormat value={data.value} displayType="text" thousandSeparator="," prefix="$" suffix=" USD" decimalScale={2} />}
        hovering={hovering}
        details={details}
        setOpenDetail={setOpenDetail}
      />
    </>
  );
};

export default TokenItem;

TokenItem.defaultProps = {
  details: null,
  hovering: false,
};

TokenItem.propTypes = {
  details: PropTypes.objectOf(PropTypes.any),
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  setOpenDetail: PropTypes.func.isRequired,
  hovering: PropTypes.bool,
};
