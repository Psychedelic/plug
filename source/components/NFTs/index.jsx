import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { useTranslation } from 'react-i18next';
import LoadingWrapper from '../LoadingWrapper';
import { useRouter } from '../Router';
import { setNfts, setSelectedNft, setNftsLoading } from '../../redux/nfts';
import useStyles from './styles';
import EmptyState from './components/EmptyState';

const NFTs = () => {
  const classes = useStyles();
  const { navigator } = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { nfts, nftsLoading } = useSelector((state) => state.nfts);
  const [loading, setLoading] = useState(true);

  const handleNftClick = (nft) => {
    dispatch(setSelectedNft(nft));
    navigator.navigate('nft-details');
  };

  useEffect(() => {
    sendMessage({
      type: HANDLER_TYPES.GET_NFTS,
    }, (myNfts) => {
      dispatch(setNfts(myNfts));
      dispatch(setNftsLoading(false));
    });
  }, []);

  useEffect(() => {
    setLoading(nftsLoading);
  }, [nftsLoading]);

  return (
    <LoadingWrapper loading={loading} className="small">
      {
        !nfts?.length
          ? <EmptyState />
          : (
            <div className={classes.root}>
              <Typography variant="h5" className={classes.title}>{t('nfts.allNfts')}</Typography>
              <div className={classes.grid}>
                {
                nfts?.map((nft) => (
                  <div
                    className={classes.nftContainer}
                    onClick={() => handleNftClick(nft)}
                  >
                    <img src={nft.url} className={classes.nft} />
                    <Typography className={classes.id} variant="subtitle1">{nft.id}</Typography>
                  </div>
                ))
              }
              </div>
            </div>
          )
      }

    </LoadingWrapper>
  );
};

export default NFTs;
