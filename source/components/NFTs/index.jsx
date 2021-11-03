import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBatchedNFTs } from '@psychedelic/dab-js';
import { Principal } from '@dfinity/principal';
import JsonBigint from 'json-bigint';

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

  useEffect(() => {
    // Update cache
    dispatch(setCollectionsLoading(true));
    sendMessage({
      type: HANDLER_TYPES.GET_NFTS,
      params: {},
    }, (nftCollections) => {
      if (nftCollections?.length) {
        dispatch(setCollections({ collections: nftCollections, walletNumber }));
      }
    });
    if (principalId) {
      getBatchedNFTs({
        principal: Principal.fromText(principalId),
        onFinish: (cols) => {
          dispatch(setCollections({
            collections: cols.map((col) => JsonBigint.parse(col)),
            walletNumber,
          }));
          dispatch(setCollectionsLoading(false));
        },
        callback: (collection) => {
          dispatch(addCollection({
            collection: JsonBigint.parse(collection),
            walletNumber,
          }));
        },
      });
    }
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
