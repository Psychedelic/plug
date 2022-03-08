import React, { useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { IconButton, Typography } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';

import SwapIcon from '../SwapIcon';
import useStyles from '../../styles';

const TokenItem = ({
  date,
  details,
  setOpenDetail,
  hovering,
}) => {
  const { t } = useTranslation();
  const [iconHovered, setIconHovered] = useState(false);

  const { swap } = details?.sonicData || {};

  const classes = useStyles();

  return (
    <>
      <SwapIcon fromCurrency={swap?.from} toCurrency={swap?.to} setHovering={setIconHovered} />
      <div className={classes.leftContainer}>
        <Typography variant="h5">
          {`${t('activity.title.swap')} ${swap?.from?.name} ${t('activity.title.for')} ${swap?.to?.name || t('common.unknownToken')}`}
        </Typography>
        <Typography variant="subtitle2">
          {moment(date).format('MMM Do')}
        </Typography>
      </div>
      <div className={classes.rightContainer}>
        <div className={classes.amountContainer}>
          {/* TODO: Add correct formatting */}
          <Typography variant="h5">
            {iconHovered ? 'TODO Hover' : 'TODO'}
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
