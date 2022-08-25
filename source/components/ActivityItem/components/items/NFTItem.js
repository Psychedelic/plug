import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { capitalize } from '@material-ui/core';
import UnknownIcon from '@assets/icons/unknown-icon.svg';
import shortAddress from '@shared/utils/short-address';

import GenericIcon from '../../../GenericIcon';

import ActivityItemDisplay from '../ActivityItemDisplay';
import ActivityItemDetails from '../ActivityItemDetails';
import { getSubtitle } from '../../utils';

const NFTItem = ({
  type,
  to,
  from,
  date,
  logo,
  canisterId,
  details,
  setOpenDetail,
  hovering,
  copied,
  onCopy,
  tooltipText,
}) => {
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
        title={`${capitalize(type?.toLowerCase())} NFT`}
        subtitle={moment(date).format('MMM Do')}
        tooltip={getSubtitle(type, to, from, t, canisterId)}
        copied={copied}
        tooltipText={tooltipText}
        onCopy={onCopy}
      />
      <ActivityItemDetails
        main={details?.tokenId?.length > 5 ? shortAddress(details?.tokenId) : `#${details?.tokenId}`}
        secondary={details?.canisterInfo?.name || shortAddress(canisterId)}
        hovering={hovering}
        details={details}
        setOpenDetail={setOpenDetail}
      />
    </>
  );
};

export default NFTItem;

NFTItem.defaultProps = {
  to: null,
  from: null,
  type: 'PLUG',
  name: null,
  canisterId: null,
  details: null,
  hovering: false,
};

NFTItem.propTypes = {
  type: PropTypes.number,
  canisterId: PropTypes.string,
  details: PropTypes.objectOf(PropTypes.string),
  to: PropTypes.string,
  from: PropTypes.string,
  logo: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  name: PropTypes.string,
  setOpenDetail: PropTypes.func.isRequired,
  hovering: PropTypes.bool,
  copied: PropTypes.bool.isRequired,
  onCopy: PropTypes.func.isRequired,
  tooltipText: PropTypes.string.isRequired,
};
