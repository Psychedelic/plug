import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBatchedNFTs } from '@psychedelic/dab-js';
import { Principal } from '@dfinity/principal';

import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import LoadingWrapper from '../LoadingWrapper';
import { addCollection, setCollections, setCollectionsLoading } from '../../redux/wallet';
import useStyles from './styles';
import EmptyState from './components/EmptyState';
import NFTCollection from './components/NFTCollection';

const NFTs = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    collections, collectionsLoading, walletNumber, principalId,
  } = useSelector((state) => state.wallet);
  const [loading, setLoading] = useState(collectionsLoading);

  useEffect(() => {
    // Update cache
    sendMessage({
      type: HANDLER_TYPES.GET_NFTS,
      params: {},
    }, (nftCollections) => {
      if (nftCollections?.length) {
        dispatch(setCollections({ collections: nftCollections, walletNumber }));
        dispatch(setCollectionsLoading(false));
      }
    });
    getBatchedNFTs({
      principal: Principal.fromText(principalId),
      callback: (collection) => {
        if (collection?.tokens?.length) {
          dispatch(addCollection({ collection, walletNumber }));
          dispatch(setCollectionsLoading(false));
        }
      },
    });
  }, [walletNumber]);

  useEffect(() => {
    setLoading(collectionsLoading);
  }, [collectionsLoading]);

  return (
    <LoadingWrapper loading={loading} className="big">
      {
        !collections?.length
          ? <EmptyState />
          : (
            <div className={classes.root}>
              {collections.map((collection) => (
                <NFTCollection collection={collection} />
              ))}
            </div>
          )
      }

    </LoadingWrapper>
  );
};

export default NFTs;
