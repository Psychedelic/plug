import React, { useState } from 'react';
import Collapsible from 'react-collapsible';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import { ChevronDown } from 'react-feather';

import { useRouter } from '@components/Router';
import { setSelectedNft } from '@redux/nfts';
import { NFTDisplayer, ICNSDisplay } from '@ui';

import shortAddress from '@shared/utils/short-address';
import useStyles from './styles';

function NFTCollection({ collection, icns }) {
  const classes = useStyles();
  const { navigator } = useRouter();
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  const handleNftClick = (nft) => {
    dispatch(setSelectedNft(nft));
    navigator.navigate('nft-details');
  };

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className={classes.collection}>
      <Collapsible
        trigger={(
          <div className={classes.collectionHeader} onClick={toggleExpanded}>
            <div className={classes.collectionTitle}>
              <img loading="lazy" src={collection?.icon} className={classes.collectionIcon} />
              <Typography variant="h5">{collection?.name}</Typography>
            </div>
            <ChevronDown
              className={clsx(classes.expandIcon, expanded && classes.rotate)}
              size={20}
            />
          </div>
        )}
      >
        <div className={clsx(classes.grid, expanded && classes.expanded)}>
          {collection?.tokens?.map((nft) => (
            <div
              className={classes.nftContainer}
              onClick={() => handleNftClick(nft)}
            >
              {icns ? (
                <ICNSDisplay
                  icns={nft}
                  className={classes.nft}
                  onClick={() => handleNftClick(nft)}
                />
              ) : (
                <NFTDisplayer
                  url={nft.url}
                  className={classes.nft}
                  onClick={() => handleNftClick(nft)}
                />
              )}
              <Typography
                className={classes.id}
                variant="subtitle1"
              >
                {(nft.name || `#${nft.index}`).length > 12 ? shortAddress(nft.name || `#${nft.index}`, 3, 5) : (nft.name || `#${nft.index}`)}
              </Typography>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  );
}

NFTCollection.propTypes = {
  icns: PropTypes.bool.isRequired,
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
