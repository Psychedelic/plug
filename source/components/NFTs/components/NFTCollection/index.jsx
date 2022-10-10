import React, { useState } from 'react';
import Collapsible from 'react-collapsible';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import { ChevronDown } from 'react-feather';

import { shortICNSName } from '@shared/services/ICNS';
import { useRouter } from '@components/Router';
import { setSelectedNft } from '@redux/nfts';
import { NFT_COLLECTION_DEFAULT_TYPES } from '@shared/constants/nft';
import imageIcon from '@assets/icons/imageIcon.svg';
import NFTDisplayer from '../../../NFTDisplayer';
import ICNSDisplay from '../../../ICNSDisplay';

import useStyles from './styles';

function NFTCollection({
  collection, icns, defaultOpen, collectionTestID,
}) {
  const classes = useStyles();
  const { navigator } = useRouter();
  const [expanded, setExpanded] = useState(defaultOpen);
  const dispatch = useDispatch();

  const handleNftClick = (nft) => {
    dispatch(setSelectedNft(nft));
    navigator.navigate('nft-details');
  };

  const toggleExpanded = () => setExpanded(!expanded);
  const nftDefaultTag = NFT_COLLECTION_DEFAULT_TYPES[collection.canisterId];

  return (
    <Collapsible
      transitionTime={200}
      open={expanded}
      trigger={(
        <div className={classes.collectionHeader} onClick={toggleExpanded} data-testid={`${collectionTestID}-${collection?.name}`}>
          <div className={classes.collectionTitle}>
            <div className={classes.iconContainer}>
              <img
                loading="lazy"
                src={collection?.icon ? collection?.icon : imageIcon}
                className={clsx(classes.collectionIcon, icns && classes.icnsIcon)}
              />
            </div>
            <Typography variant="h5">{collection?.name}</Typography>
          </div>
          <div className={classes.numberArrowContainer}>
            <p className={classes.nftQty}>
              {collection.tokens.length}
            </p>
            {
              !!collection?.tokens.length && (
                <ChevronDown
                  className={clsx(classes.expandIcon, expanded && classes.rotate)}
                  size={20}
                />
              )
            }
          </div>
        </div>
        )}
    >
      <div className={clsx(classes.grid, expanded && classes.expanded)}>
        {collection?.tokens?.map((nft) => {
          const name = nft.name || `#${nft.index}`;
          return (
            <div
              className={classes.nftContainer}
              onClick={() => handleNftClick(nft)}
              data-testid={`nft-id-${name}`}
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
                  defaultTag={nftDefaultTag}
                  onClick={() => handleNftClick(nft)}
                />
              )}
              {!icns && (
              <Typography
                className={classes.id}
                variant="subtitle1"
              >
                {name.length > 12 ? shortICNSName(name) : name}
              </Typography>
              )}
            </div>
          );
        })}
      </div>
    </Collapsible>
  );
}

NFTCollection.defaultProps = {
  defaultOpen: false,
  collectionTestID: '',
};

NFTCollection.propTypes = {
  icns: PropTypes.bool.isRequired,
  defaultOpen: PropTypes.bool,
  collectionTestID: PropTypes.string,
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
