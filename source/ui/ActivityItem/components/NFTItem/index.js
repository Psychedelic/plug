import React, { useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import {
  capitalize, IconButton, Typography, Tooltip,
} from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';

import UnknownIcon from '@assets/icons/unknown-icon.svg';

import shortAddress from '@shared/utils/short-address';

import { GenericIcon } from '@ui';

import useStyles from '../../styles';

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
  canisterInfo,
  setOpenDetail,
  hovering,
}) => {
  const { t } = useTranslation();

  const classes = useStyles();

  const [copied, setCopied] = useState(false);

  const copyText = t('copy.copyTextAddress');
  const copiedText = t('copy.copiedText');
  const [showTooltip, setShowTooltip] = useState(false);
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
      <GenericIcon
        image={image || UnknownIcon}
        type={type}
      />
      <div className={classes.leftContainer}>
        <Typography variant="h5">
          {`${capitalize(type?.toLowerCase())} NFT`}
        </Typography>
        <Typography
          variant="subtitle2"
          onClick={handleClickCopy}
          onMouseOver={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {moment(date).format('MMM Do')}
          <Tooltip
            classes={{ tooltipPlacementBottom: classes.tooltip }}
            title={tooltipText}
            arrow
            open={showTooltip || copied}
            placement="bottom"
          >
            <span>{getSubtitle(type, to, from, t, canisterId)}</span>
          </Tooltip>
        </Typography>
      </div>
      <div className={classes.rightContainer}>
        <div className={classes.tokenContainer}>
          <Typography variant="h5">
            {details?.tokenId?.length > 5 ? shortAddress(details?.tokenId) : `#${details?.tokenId}`}
          </Typography>
          <Typography variant="subtitle2">
            {canisterInfo?.name || canisterId}
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
  canisterInfo: {},
  hovering: false,
};

NFTItem.propTypes = {
  canisterInfo: PropTypes.objectOf(PropTypes.any),
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
