import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { useRouter } from '@components/Router';
import { setSelectedNft } from '@redux/nfts';
import { NFTDisplayer } from '@ui';

import useStyles from './styles';

function NFTCollection({ collection }) {
  const classes = useStyles();
  const { navigator } = useRouter();
  const dispatch = useDispatch();

  const handleNftClick = (nft) => {
    dispatch(setSelectedNft(nft));
    navigator.navigate('nft-details');
  };

  return (
    <div className={classes.collection}>
      <Typography variant="h5" className={classes.title}>{collection?.name}</Typography>
      <div className={classes.grid}>
        {
        collection?.tokens?.map((nft) => (
          <div
            className={classes.nftContainer}
            onClick={() => handleNftClick(nft)}
          >
            <NFTDisplayer url={nft.url} className={classes.nft} onClick={() => handleNftClick(nft)}/>
            <Typography className={classes.id} variant="subtitle1">{nft.name || `#${nft.index}`}</Typography>
          </div>
        ))
      }
      </div>
    </div>
  );
}

NFTCollection.propTypes = {
  collection: PropTypes.shape({
    standard: PropTypes.string.isRequired,
    canisterId: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tokens: PropTypes.arrayOf(PropTypes.shape({
      index: PropTypes.number,
      canister: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      url: PropTypes.string,
        metadata: PropTypes.any, // eslint-disable-line
    })).isRequired,
  }).isRequired,
};

export default NFTCollection;
