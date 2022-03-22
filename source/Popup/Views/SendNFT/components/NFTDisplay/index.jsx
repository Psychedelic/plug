import React from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from '@material-ui/core';

import useStyles from './styles';

const NFTDisplay = ({ nft }) => {
  const classes = useStyles();
  return (
    <Card className={classes.nftDisplayContainer}>
      <img className={classes.nftImage} src={nft?.url} />
      <div className={classes.nftInfo}>
        <Typography variant="subtitle1">{nft?.collection}</Typography>
        <Typography variant="subtitle2">{`#${nft?.index}`}</Typography>
      </div>
    </Card>
  );
};

NFTDisplay.propTypes = {
  nft: PropTypes.shape({
    url: PropTypes.string,
    collection: PropTypes.string,
    index: PropTypes.number,
  }).isRequired,
};

export default NFTDisplay;
