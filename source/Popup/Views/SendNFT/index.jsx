import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import BackIcon from '@assets/icons/back.svg';
import { Layout, IDInput } from '@components';
import { TABS, useRouter } from '@components/Router';
import {
  Header, LinkButton, Container, FormItem, Select, Button, Alert,
} from '@ui';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { validatePrincipalId } from '@shared/utils/ids';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { removeNFT, setCollections } from '@redux/wallet';
import { setSelectedNft } from '@redux/nfts';

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

const getFilteredCollections = (collection, collections, nft) => {
  const filterNFT = (token) => token.id !== nft?.id;
  const collectionIndex = collections.indexOf(collection);
  let filteredCollections = [...collections];

  if (collection.tokens.length > 1) {
    // If collection has tokens we filter them
    const filteredCollection = JSON.parse(JSON.stringify(collection));
    const tokens = collection.tokens.filter(filterNFT);

    filteredCollections = [...collections];

    filteredCollections[collectionIndex] = {
      ...filteredCollection,
      tokens,
    };
  } else {
    // If tokens is empty remove collection
    filteredCollections.splice(collectionIndex, 1);
  }

  return filteredCollections;
};

const SendNFT = () => {
  const { t } = useTranslation();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const { navigator } = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const { selectedNft: nft } = useSelector((state) => state.nfts);
  const { collections, principalId } = useSelector((state) => state.wallet);
  const classes = useStyles();

  const collection = useMemo(() => collections?.find(
    (col) => col.name === nft?.collection,
  ) || {},
  [collections, nft]);

  const transferNFT = () => {
    setLoading(true);
    setErrorMessage('');
    sendMessage({ type: HANDLER_TYPES.TRANSFER_NFT, params: { nft, to: address } },
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
  const fallbackNftUrl = (url) => (url?.includes?.('https') ? url : `https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app${url}`);
  const handleAddressChange = (val) => setAddress(val);
  useEffect(() => {
    if (!nft) {
      navigator.navigate('home', TABS.NFTS);
    }
  }, [nft]);

  return (
    <Layout>
      <Header
        left={<LinkButton value={t('common.back')} onClick={() => navigator.navigate('nft-details')} startIcon={BackIcon} />}
        center={t('nfts.send')}
        right={<LinkButton value={t('common.close')} onClick={() => navigator.navigate('home')} />}
      />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormItem
              label={t('nfts.nft')}
              component={(
                <Select
                  image={fallbackNftUrl(nft?.url)}
                  name={nft?.name || `${collection?.name ?? ''} #${nft?.index}`}
                  text={`#${nft?.index}`}
                  imageClassName={classes.nftImage}
                  nft
                  readonly
                  shadow
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <FormItem
              label={t('nfts.sendTo')}
              component={(
                <IDInput
                  value={address}
                  onChange={handleAddressChange}
                  isValid={address === null || validatePrincipalId(address)}
                  placeholder={t('nfts.inputPrincipalId')}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="rainbow"
              value={t('common.continue')}
              fullWidth
              disabled={
                address === null
                || !validatePrincipalId(address)
                || address === ''
              }
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
    </Layout>
  );
};

export default SendNFT;
