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
    collections, collectionsLoading, walletNumber, optimisticNFTUpdate,
  } = useSelector((state) => state.wallet);

  useEffect(() => {
    // Update cache
    dispatch(setCollectionsLoading(true));
    sendMessage({
      type: HANDLER_TYPES.GET_NFTS,
      params: { refresh: false },
    }, (nftCollections) => {
      if (nftCollections?.length && !optimisticNFTUpdate) {
        dispatch(setCollections({ collections: nftCollections, walletNumber }));
      }
      dispatch(setCollectionsLoading(false));
    });
  }, [walletNumber]);
  const nfts = collections?.flatMap((c) => c.tokens);
  return (
    <LoadingWrapper loading={!nfts.length && collectionsLoading} className="big">
      {
        !nfts?.length
          ? <EmptyState />
          : (
            <div className={classes.root}>
              {collections.map((collection) => !!collection?.tokens?.length
                && (<NFTCollection collection={collection} />))}
            </div>
          )
      }

    </LoadingWrapper>
  );
};

export default NFTs;
