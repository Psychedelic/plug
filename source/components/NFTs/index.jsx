import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { useRouter } from '@components/Router';
import { useDispatch, useSelector } from 'react-redux';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import LoadingWrapper from '@components/LoadingWrapper';
import { setNfts, setSelectedNft, setNftsLoading } from '../../redux/nfts';
import useStyles from './styles';

const NFTs = () => {
  const classes = useStyles();
  const { navigator } = useRouter();
  const dispatch = useDispatch();

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
      console.log('mynfts', myNfts);
      dispatch(setNfts(myNfts));
      dispatch(setNftsLoading(false));
    });
  }, []);

  useEffect(() => {
    setLoading(nftsLoading);
  }, [nftsLoading]);

  return (
    <LoadingWrapper loading={loading} className="small">
      <div className={classes.root}>
        <Typography variant="h5" className={classes.title}>All NFTs</Typography>
        <div className={classes.grid}>
          {
            nfts?.map((nft) => (
              <div
                className={classes.nftContainer}
                onClick={() => handleNftClick(nft)}
              >
                <img src={nft.img} className={classes.nft} />
                <Typography className={classes.id} variant="subtitle1">{nft.id}</Typography>
              </div>
            ))
          }
        </div>
      </div>
    </LoadingWrapper>
  );
};

export default NFTs;
