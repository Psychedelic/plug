import React, { useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { capitalize } from '@material-ui/core';

import UnknownIcon from '@assets/icons/unknown-icon.svg';

import shortAddress from '@shared/utils/short-address';

import { GenericIcon } from '@ui';

import ActivityItemDisplay from '../ActivityItemDisplay';
import ActivityItemDetails from '../ActivityItemDetails';

const getSubtitle = (type, to, from, t) => (({
  SEND: ` · ${t('activity.subtitle.to')}: ${shortAddress(to)}`,
  RECEIVE: ` · ${t('activity.subtitle.from')}: ${shortAddress(from)}`,
})[type]);

const getAddress = (type, to, from, canisterId) => (
  {
    SEND: to,
    RECEIVE: from,
  }
)[type] || canisterId || '';

const NFTItem = ({
  type,
  to,
  from,
  date,
  image,
  canisterId,
  details,
  setOpenDetail,
  hovering,
}) => {
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  const copyText = t('copy.copyTextAddress');
  const copiedText = t('copy.copiedText');
  const [tooltipText, setTooltipText] = useState(copyText);

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

  return (
    <>
      <ActivityItemDisplay
        image={(
          <GenericIcon
            image={image || UnknownIcon}
            type={type}
          />
        )}
        title={`${capitalize(type?.toLowerCase())} NFT`}
        subtitle={moment(date).format('MMM Do')}
        tooltip={getSubtitle(type, to, from, t, canisterId)}
        copied={copied}
        tooltipText={tooltipText}
        onCopy={handleClickCopy}
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
  details: PropTypes.objectOf(PropTypes.any),
  to: PropTypes.string,
  from: PropTypes.string,
  image: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  name: PropTypes.string,
  setOpenDetail: PropTypes.func.isRequired,
  hovering: PropTypes.bool,
};
