import React from 'react';
import { Typography } from '@material-ui/core';
import ArrowUpRight from '@assets/icons/arrow-up-right.png';
import browser from 'webextension-polyfill';
import PropTypes from 'prop-types';
import useStyles from '../styles';

const redirectToICRocks = (canisterId) => () => {
  browser.tabs.create({ url: `https://ic.rocks/principal/${canisterId}` });
};

const WhitelistItem = ({ canisterId }) => {
  const classes = useStyles();

  return (
    <div className={classes.whitelistItem}>
      <Typography variant="h5">{canisterId}</Typography>
      <img
        src={ArrowUpRight}
        className={classes.arrowUpRight}
        onClick={redirectToICRocks(canisterId)}
      />
    </div>
  );
};

export default WhitelistItem;

WhitelistItem.propTypes = {
  canisterId: PropTypes.string.isRequired,
};
