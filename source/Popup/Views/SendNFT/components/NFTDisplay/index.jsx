import React from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from '@material-ui/core';

import { NFTDisplayer } from '@ui';

import useStyles from './styles';

const NFTDisplay = ({ nft }) => {
  const classes = useStyles();

  const nftDefaultTag = nft.canisterId === 'pk6rk-6aaaa-aaaae-qaazq-cai' ? 'iframe' : undefined;

  return (
    <Card className={classes.nftDisplayContainer}>
      <NFTDisplayer url={nft?.url} className={classes.nftImage} defaultTag={nftDefaultTag} />
      <div className={classes.nftInfo}>
        <Typography variant="h2">{nft?.collection}</Typography>
        <Typography variant="subtitle1">{`#${nft?.index}`}</Typography>
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
