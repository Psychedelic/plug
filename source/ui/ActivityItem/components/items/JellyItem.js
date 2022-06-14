import React, { useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

import JellyIcon from '@assets/icons/jelly-icon.svg';
import { useICPPrice } from '@redux/icp';
import { E8S_PER_ICP } from '@shared/constants/currencies';

import ActivityItemDisplay from '../ActivityItemDisplay';
import ActivityItemDetails from '../ActivityItemDetails';
import GenericIcon from '../../../GenericIcon';

const getJellyEventTitle = (type) => ({
  DIRECTBUY: 'Buy NFT',
  MAKELISTING: 'List NFT',
  CANCELLISTING: 'Cancel NFT Listing',
  MAKEOFFER: 'Make Offer',
  ACCEPTOFFER: 'Accept Offer',
  CANCELOFFER: 'Cancel Offer',
  DENYOFFER: 'Deny Offer',
}[type]) || 'Jelly Event';

const getJellyData = (details, type, icpPrice) => {
  const { price: e8s, tokenId } = details || {};
  const wicpAmount = e8s / E8S_PER_ICP;
  const title = getJellyEventTitle(type);
  const price = wicpAmount * icpPrice;
  return {
    price, title, tokenId, wicpAmount,
  };
};

const JellyItem = ({
  date,
  details,
  setOpenDetail,
  hovering,
  type,
}) => {
  const icpPrice = useICPPrice();
  const [iconHovered, setIconHovered] = useState(false);
  const data = getJellyData(details, type, icpPrice);
  const mainDetail = iconHovered ? <NumberFormat value={data.wicpAmount} displayType="text" thousandSeparator="," suffix=" WICP" decimalScale={5} /> : `#${data?.tokenId}`;
  const secondaryDetail = iconHovered ? <NumberFormat value={data.price} displayType="text" thousandSeparator="," prefix="$" decimalScale={5} /> : 'Crowns';
  return (
    <>
      <ActivityItemDisplay
        image={(
          <div
            onMouseEnter={() => setIconHovered(true)}
            onMouseLeave={() => setIconHovered(false)}
          >
            <GenericIcon
              image={JellyIcon}
              type="JELLY"
            />
          </div>
          )}
        title={data?.title}
        subtitle={moment(date).format('MMM Do')}
      />
      <ActivityItemDetails
        main={mainDetail}
        secondary={secondaryDetail}
        hovering={hovering}
        details={details}
        setOpenDetail={setOpenDetail}
      />
    </>
  );
};

export default JellyItem;

JellyItem.defaultProps = {
  details: null,
  hovering: false,
};

JellyItem.propTypes = {
  details: PropTypes.objectOf(PropTypes.string),
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  setOpenDetail: PropTypes.func.isRequired,
  hovering: PropTypes.bool,
  type: PropTypes.string.isRequired,
};
