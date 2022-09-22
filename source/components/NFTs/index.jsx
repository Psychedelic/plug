import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Principal } from '@dfinity/principal';
import { HttpAgent } from '@dfinity/agent';
import fetch from 'cross-fetch';

import { HANDLER_TYPES, recursiveParseBigint, sendMessage } from '@background/Keyring';

import {
  Button, Dialog, FormItem, Select, TextInput,
} from '@components';
import { useRouter } from '@components/Router';
import { getNFTActor, getUserCollectionTokens } from '@psychedelic/dab-js';
import { setSelectedNft } from '@redux/nfts';
import { NFT } from '@psychedelic/dab-js/dist/constants/standards';

import LoadingWrapper from '../LoadingWrapper';
import { setCollections, setCollectionsLoading } from '../../redux/wallet';
import useStyles from './styles';

const NFTs = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [collectionFetched, setCollectionFetched] = useState(false);
  const [NFTStandard, setNFTStandard] = useState(NFT.dip721v2);
  const [canisterId, setCanisterId] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [NFTStandardOpen, setNFTStandardDialogOpen] = useState(false);
  const { navigator } = useRouter();

  const {
    collections, collectionsLoading, principalId, optimisticNFTUpdate,
  } = useSelector((state) => state.wallet);

  const fetchCollectionTokens = async () => {
    setCollectionLoading(true);
    const collection = {
      icon: '',
      name: '',
      description: '',
      principal_id: canisterId,
      standard: NFTStandard,
    };
    const tokens = await getUserCollectionTokens(collection, Principal.fromText(principalId));
    setCollectionFetched(true);
    setAvailableTokens(tokens.tokens.map((token) => token.index).sort());
  };

  const redirectToTokenDetails = async () => {
    // fetch selected token details and then
    const nftActor = await getNFTActor({ canisterId, standard: NFTStandard, agent: new HttpAgent({ fetch, host: 'https://ic0.app/' }) });
    const nft = await nftActor.details(selectedToken);
    dispatch(setSelectedNft(recursiveParseBigint(nft)));
    navigator.navigate('nft-details');
  };

  useEffect(() => {
    // Update cache
    if (!collectionsLoading) {
      dispatch(setCollectionsLoading(true));
      sendMessage({
        type: HANDLER_TYPES.GET_NFTS,
        params: {},
      }, (nftCollections) => {
        if (nftCollections?.length && !optimisticNFTUpdate) {
          dispatch(setCollections({ collections: nftCollections, principalId }));
        }
        dispatch(setCollectionsLoading(false));
      });
    }
  }, [principalId]);

  const nfts = collections?.flatMap((c) => c.tokens);
  return collectionFetched ? (
    <div className={classes.root}>
      <FormItem
        smallLabel
        label="Select the token"
        component={(
          <Select
            image=""
            name={selectedToken || availableTokens[0]}
            onClick={() => setTokenDialogOpen(true)}
            shadow
            className={`${classes.select} ${classes.canisterId}`}
            data-testid="token-standard-select"
          />
        )}
      />
      {tokenDialogOpen && (
        <Dialog
          title="Select the token to transfer"
          items={availableTokens.map((token) => ({ name: token?.toString() }))}
          onClose={(value) => {
            setSelectedToken(value?.name);
            setTokenDialogOpen(false);
          }}
          selectedValue={selectedToken}
          open={tokenDialogOpen}
        />
      )}
      <Button
        variant="rainbow"
        value="Continue"
        onClick={redirectToTokenDetails(selectedToken)}
        fullWidth
        disabled={!selectedToken}
        data-testid="continue-button"
      />
    </div>
  ) : (
    <div className={classes.container}>
      <LoadingWrapper loading={!nfts.length && collectionsLoading} className="big">
        <div className={classes.canisterId}>
          <FormItem
            smallLabel
            label="NFT Canister ID"
            component={(
              <TextInput
                fullWidth
                value={canisterId}
                onChange={(value) => setCanisterId(value.target.value)}
                type="text"
                data-testid="token-canister-id-input"
              />
              )}
          />
          <FormItem
            smallLabel
            label="Select the standard"
            component={(
              <Select
                image=""
                name={NFTStandard}
                onClick={() => setNFTStandardDialogOpen(true)}
                shadow
                className={`${classes.select} ${classes.canisterId}`}
                data-testid="token-standard-select"
              />
          )}
          />
          {NFTStandardOpen && (
          <Dialog
            title="Select the standard"
            items={Object.values(NFT).map((token) => ({ name: token?.toString() }))}
            onClose={(value) => {
              setNFTStandard(value.name);
              setNFTStandardDialogOpen(false);
            }}
            selectedValue={NFTStandard}
            open={tokenDialogOpen}
          />
          )}
        </div>
        <Button
          variant="rainbow"
          value="Fetch collection"
          onClick={fetchCollectionTokens}
          fullWidth
          disabled={!canisterId}
          loading={collectionLoading}
          data-testid="continue-button"
        />
      </LoadingWrapper>
    </div>
  );
};

export default NFTs;
