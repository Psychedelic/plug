import React, { useState, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { TABS } from '@components/Router';
import {
  Container, Button, Alert,
} from '@ui';
import { AddressTranslation } from '@components';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { removeNFT, setCollections } from '@redux/wallet';
import { setSelectedNft } from '@redux/nfts';
import { ADDRESS_TYPES } from '@shared/constants/addresses';

import { getFilteredCollections } from '../../utils';
import NFTDisplay from '../NFTDisplay';

const useStyles = makeStyles(() => ({
  appearAnimation: {
    animationName: '$appear',
    animationDuration: '0.5s',
  },
  nftImage: {
    height: 42,
    width: 42,
    borderRadius: 5,
  },
}));

const ReviewStep = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { collections, principalId } = useSelector((state) => state.wallet);
  const { selectedNft: nft, sendAddress, resolvedSendAddress } = useSelector((state) => state.nfts);

  const collection = useMemo(() => collections?.find(
    (col) => col.name === nft?.collection,
  ) || {},
  [collections, nft]);

  const transferNFT = () => {
    setLoading(true);
    setErrorMessage('');
    const to = resolvedSendAddress?.address;
    sendMessage({ type: HANDLER_TYPES.TRANSFER_NFT, params: { nft, to } },
      ({ error }) => {
        setLoading(false);
        if (error) {
          setErrorMessage(error);
        } else {
          const filteredCollections = getFilteredCollections(collection, collections, nft);

          dispatch(setCollections({
            collections: filteredCollections,
            principalId,
          }));
          dispatch(removeNFT(nft));
          dispatch(setSelectedNft(null));
          navigator.navigate('home', TABS.NFTS);
        }
      });
  };
  const addresses = sendAddress?.type === ADDRESS_TYPES.ICNS
    ? [sendAddress, resolvedSendAddress]
    : [sendAddress];

  return (
    <Container>
      <Grid container spacing={2}>
        {/* <NFTDisplay nft={nft} /> */}
        <AddressTranslation addresses={addresses} loading={loading} />
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('common.confirm')}
            fullWidth
            onClick={transferNFT}
            loading={loading}
          />
        </Grid>
        {errorMessage?.length > 0 && (
        <Grid item xs={12}>
          <div className={classes.appearAnimation}>
            <Alert
              type="danger"
              title={(
                <span>{errorMessage}</span>
                  )}
            />
          </div>
        </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ReviewStep;
