import React from 'react';
import { useICPPrice } from '@redux/icp';
import { useContacts } from '@hooks';
import {
  setAssets,
  setAssetsLoading,
  setTransactions,
  setTransactionsLoading,
  setCollections,
  setCollectionsLoading,
} from '@redux/wallet';
import { useDispatch, useSelector } from 'react-redux';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { TABS, useRouter } from '@components/Router';
import RefreshAsset from '@assets/icons/refresh.svg';

import useStyles from './styles';

const ConnectionControls = () => {
  const icpPrice = useICPPrice();
  const { getContacts } = useContacts();
  const { navigator } = useRouter();
  const dispatch = useDispatch();
  const { principalId } = useSelector((state) => state.wallet);
  const classes = useStyles();
  const { useICNS } = useSelector((state) => state.icns);

  const refreshWallet = () => {
    navigator.navigate('home', TABS.TOKENS);

    if (icpPrice) {
      // Contacts
      getContacts(true);

      // NFTS
      dispatch(setCollectionsLoading(true));
      sendMessage({
        type: HANDLER_TYPES.GET_NFTS,
        params: { refresh: true },
      }, (nftCollections) => {
        if (nftCollections?.length) {
          dispatch(setCollections({ collections: nftCollections, principalId }));
        }
        dispatch(setCollectionsLoading(false));
      });

      // Transactions
      dispatch(setTransactionsLoading(true));
      sendMessage({
        type: HANDLER_TYPES.GET_TRANSACTIONS,
        params: {},
      }, (trxs) => {
        dispatch(setTransactions({ ...trxs, icpPrice, useICNS }));
        dispatch(setTransactionsLoading(false));
      });

      // Tokens
      dispatch(setAssetsLoading(true));
      sendMessage({
        type: HANDLER_TYPES.GET_ASSETS,
        params: { refresh: true },
      }, (keyringAssets) => {
        dispatch(setAssets({ keyringAssets, icpPrice }));
        dispatch(setAssetsLoading(false));
      });
    }
  };
  return (
    <div className={classes.controls}>
      <div className={classes.networkSelector}>
        <div className={classes.statusDot} />
        <span className={classes.network}>Mainnet</span>
      </div>
      <div className={classes.reloadIconContainer} onClick={refreshWallet}>
        <img src={RefreshAsset} alt="reload" className={classes.reloadIcon} />
      </div>
    </div>
  );
};

export default ConnectionControls;
