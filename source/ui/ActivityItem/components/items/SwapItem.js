import React, { useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import SwapIcon from '../SwapIcon';
import ActivityItemDisplay from '../ActivityItemDisplay';
import ActivityItemDetails from '../ActivityItemDetails';

const TokenItem = ({
  date,
  details,
  setOpenDetail,
  hovering,
}) => {
  const { t } = useTranslation();
  const [iconHovered, setIconHovered] = useState(false);

  const { swap } = details?.sonicData || {};

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
        main={iconHovered ? 'TODO Hover' : 'TODO'}
        secondary=""
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
