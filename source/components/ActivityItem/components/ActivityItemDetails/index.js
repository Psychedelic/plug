import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { IconButton, Typography } from '@material-ui/core';

import ArrowUpRight from '@assets/icons/arrow-up-right.png';
import ListIcon from '@material-ui/icons/List';

import useStyles from './styles';

const ActivityItemDetails = ({
  main,
  secondary,
  isTransaction,
  hovering,
  details,
  setOpenDetail,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.rightContainer}>
      <div className={classes.amountContainer}>
        <Typography variant="h5">
          {main}
        </Typography>
        <Typography variant="subtitle2">
          {secondary}
        </Typography>
      </div>
      <div className={clsx(classes.iconContainer, hovering && classes.iconContainerAnimation)}>
        {isTransaction ? (
          <img
            src={ArrowUpRight}
          />
        ) : details && (
        <IconButton size="small" onClick={() => setOpenDetail(true)} className={classes.detailsIcon}>
          <ListIcon />
        </IconButton>
        )}
      </div>
    </div>
  );
};

ActivityItemDetails.propTypes = {
  main: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
  isTransaction: PropTypes.bool.isRequired,
  hovering: PropTypes.bool.isRequired,
  details: PropTypes.objectOf(PropTypes.string).isRequired,
  setOpenDetail: PropTypes.func.isRequired,
};

export default ActivityItemDetails;
