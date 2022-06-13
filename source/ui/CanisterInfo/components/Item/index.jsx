import React, { useCallback } from 'react';
import {
  IconButton, Typography, Box,
} from '@material-ui/core';
import ArrowUpRight from '@assets/icons/arrow-up-right.png';
import extension from 'extensionizer';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { getPrincipalDashboardURL } from '@shared/constants/urls';
import useStyles from './styles';

const CanisterInfoItem = ({
  canister, className, defaultBoxClassName, ...props
}) => {
  const classes = useStyles();

  const {
    id, name, icon, iconAlt,
  } = canister || {};

  const createICRocksPrincipalTab = useCallback(() => {
    extension.tabs.create({ url: getPrincipalDashboardURL(id) });
  }, [id]);

  return (
    <div {...props} className={clsx(classes.canisterInfoItem, className)}>
      {name ? (
        <>
          <img src={icon} alt={iconAlt ?? name} className={classes.image} />

          <Box className={classes.infoBox}>
            <Typography component="h4" variant="h5">{name}</Typography>
            <Typography component="p" variant="subtitle1">{id}</Typography>
          </Box>

          <IconButton onClick={createICRocksPrincipalTab} className={classes.iconButton}>
            <img src={ArrowUpRight} alt="Arrow" />
          </IconButton>
        </>
      ) : (
        <Box className={clsx(classes.canisterInfoIdItem, defaultBoxClassName)}>
          <Typography component="p" variant="subtitle1">{id}</Typography>
          <IconButton onClick={createICRocksPrincipalTab} className={classes.iconButton}>
            <img src={ArrowUpRight} alt="Arrow" />
          </IconButton>
        </Box>
      )}

    </div>
  );
};

export default CanisterInfoItem;

CanisterInfoItem.displayName = 'CanisterInfoItem';

CanisterInfoItem.defaultProps = {
  defaultBoxClassName: '',
  className: '',
};

CanisterInfoItem.propTypes = {
  canister: PropTypes.objectOf(PropTypes.string).isRequired,
  className: PropTypes.string,
  defaultBoxClassName: PropTypes.string,
};
