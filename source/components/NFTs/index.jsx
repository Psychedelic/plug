import React, { useEffect, useState } from 'react';
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

  const { collections, collectionsLoading, walletNumber } = useSelector((state) => state.wallet);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('getting nfts');
    sendMessage({
      type: HANDLER_TYPES.GET_NFTS,
      params: { refresh: true },
    }, (nftCollections) => {
      dispatch(setCollections({ collections: nftCollections, walletNumber }));
      dispatch(setCollectionsLoading(false));
    });
  }, [walletNumber]);

  useEffect(() => {
    setLoading(collectionsLoading);
  }, [collectionsLoading]);

  return (
    <LoadingWrapper loading={!collections.length && loading} className="big">
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
