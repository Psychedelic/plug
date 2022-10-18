import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getNFTs } from '@redux/nfts';

import LoadingWrapper from '../LoadingWrapper';
import useStyles from './styles';
import EmptyState from './components/EmptyState';
import NFTCollection from './components/NFTCollection';

const NFTs = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { principalId } = useSelector((state) => state.wallet);
  const { collections, collectionsLoading } = useSelector((state) => state.nfts);

  useEffect(() => {
    if (!collectionsLoading) {
      dispatch(getNFTs());
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
