import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import LoadingWrapper from '../LoadingWrapper';
import { setCollections, setCollectionsLoading } from '../../redux/wallet';
import useStyles from './styles';
import EmptyState from './components/EmptyState';
import NFTCollection from './components/NFTCollection';

const NFTs = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    collections, collectionsLoading, principalId, optimisticNFTUpdate,
  } = useSelector((state) => state.wallet);

  useEffect(() => {
    // Update cache
    if (!collectionsLoading) {
      dispatch(setCollectionsLoading(true));
      sendMessage({
        type: HANDLER_TYPES.GET_NFTS,
        params: {},
      }, (nftCollections) => {
        if (nftCollections?.length && !optimisticNFTUpdate) {
          dispatch(setCollections({ collections: nftCollections, principalId }));
        }
        dispatch(setCollectionsLoading(false));
      });
    }
  }, [principalId]);

  const nfts = collections?.flatMap((c) => c.tokens);

  return (
    <LoadingWrapper loading={!nfts.length && collectionsLoading} className="big">
      {
        !nfts?.length
          ? <EmptyState />
          : (
            <div className={classes.root}>
              {collections.map((collection, index) => (
                <NFTCollection
                  collection={collection}
                  defaultOpen={index === 0}
                  icns={collection?.name === 'ICNS'}
                  collectionTestID="nft-collection-dropdown"
                />
              ))}
            </div>
          )
      }

    </LoadingWrapper>
  );
};

export default NFTs;
