import React, { useState, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { TABS } from '@components/Router';
import {
  Button, Alert,
} from '@ui';
import { AddressTranslation } from '@components';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { removeNFT, setCollections } from '@redux/wallet';
import { setSelectedNft } from '@redux/nfts';
import { ADDRESS_TYPES } from '@shared/constants/addresses';

import { getFilteredCollections } from '../../utils';
import NFTDisplay from '../NFTDisplay';

import useStyles from './styles';

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
    const to = resolvedSendAddress?.address || sendAddress?.address;
    sendMessage({ type: HANDLER_TYPES.TRANSFER_NFT, params: { nft, to } },
      (response) => {
        setLoading(false);
        if (response.error) {
          setErrorMessage(response.error);
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
    <div className={classes.reviewStepContainer}>
      <NFTDisplay nft={nft} />
      <AddressTranslation addresses={addresses} loading={loading} />
      <Button
        variant="rainbow"
        value={t('common.confirm')}
        fullWidth
        onClick={transferNFT}
        loading={loading}
        data-testid="confirmation-button"
      />
      {errorMessage?.length > 0 && (
        <div className={classes.errorBox}>
          <Alert
            type="danger"
            title={(
              <span>{errorMessage}</span>
                )}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
