import React, { useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import {
  capitalize, IconButton, Typography,
} from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';

import UnknownIcon from '@assets/icons/unknown-icon.svg';

import shortAddress from '@shared/utils/short-address';

import { GenericIcon } from '@ui';

import useStyles from '../../styles';
import ActivityItemDisplay from '../ActivityItemDisplay';

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

  const classes = useStyles();

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
      <div className={classes.rightContainer}>
        <div className={classes.tokenContainer}>
          <Typography variant="h5">
            {details?.tokenId?.length > 5 ? shortAddress(details?.tokenId) : `#${details?.tokenId}`}
          </Typography>
          <Typography variant="subtitle2">
            {details?.canisterInfo?.name || shortAddress(canisterId)}
          </Typography>
        </div>
        <div className={
          clsx(
            classes.iconContainer,
            hovering && classes.iconContainerAnimation,
          )
        }
        >
          {details && (
          <IconButton size="small" onClick={() => setOpenDetail(true)} className={classes.detailsIcon}>
            <ListIcon />
          </IconButton>
          )}
        </div>
      </div>
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
