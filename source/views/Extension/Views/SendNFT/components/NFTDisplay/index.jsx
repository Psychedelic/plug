import React from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from '@material-ui/core';
import { NFT_COLLECTION_DEFAULT_TYPES } from '@shared/constants/nft';
import { NFTDisplayer } from '@components';

import useStyles from './styles';

const NFTDisplay = ({ nft }) => {
  const classes = useStyles();

  const nftDefaultTag = NFT_COLLECTION_DEFAULT_TYPES[nft?.canisterId];
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
    canisterId: PropTypes.string,
  }).isRequired,
};

export default NFTDisplay;
