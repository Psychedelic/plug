import React, { useState, useMemo, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { TABS, useRouter } from '@components/Router';
import {
  Button, Alert,
  AddressTranslation,
} from '@components';
import { transferNFT } from '@redux/nfts';
import { ADDRESS_TYPES } from '@shared/constants/addresses';

import NFTDisplay from '../NFTDisplay';

import useStyles from './styles';

const ReviewStep = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const { navigator } = useRouter();

  const {
    selectedNft: nft,
    sendAddress,
    resolvedSendAddress,
    collections,
    collectionsLoading,
    error,
  } = useSelector((state) => state.nfts);
  const collection = useMemo(() => collections?.find(
      (col) => col.canisterId === nft?.canister,
    ) || {},
  [collections, nft]);

  const executeTransferNFT = () => {
    const to = resolvedSendAddress?.address || sendAddress?.address;
    dispatch(transferNFT({ nft, to }));
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  useEffect(() => {
    if (!nft) {
      navigator.navigate('home', TABS.NFTS);
    }
  }, [nft]);

  const addresses = sendAddress?.type === ADDRESS_TYPES.ICNS
    ? [sendAddress, resolvedSendAddress]
    : [sendAddress];

  return (
    <div className={classes.reviewStepContainer}>
      <NFTDisplay nft={{ ...nft, collection: collection?.name }} />
      <AddressTranslation addresses={addresses} loading={collectionsLoading} />
      <Button
        variant="rainbow"
        value={t('common.confirm')}
        fullWidth
        onClick={executeTransferNFT}
        loading={collectionsLoading}
        data-testid="confirmation-button"
      />
      {errorMessage?.length > 0 && (
        <div className={classes.errorBox}>
          <Alert
            type="danger"
            title={(<span>{errorMessage}</span>)}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
