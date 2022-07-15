import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize } from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { useContacts } from '@hooks';
import { useICPPrice } from '@redux/icp';
import {
  setAssets,
  setAssetsLoading,
  setTransactions,
  setTransactionsLoading,
  setCollections,
  setCollectionsLoading,
} from '@redux/wallet';
import { getCurrentNetwork } from '@redux/network';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { TABS, useRouter } from '@components/Router';
import RefreshAsset from '@assets/icons/refresh.svg';

import useStyles from './styles';

const ConnectionControls = ({ disableNavigation }) => {
  const classes = useStyles();
  const icpPrice = useICPPrice();
  const dispatch = useDispatch();
  const { getContacts } = useContacts();
  const { navigator } = disableNavigation ? {} : useRouter();
  const { principalId } = useSelector((state) => state.wallet);
  const { useICNS } = useSelector((state) => state.icns);
  const { currentNetwork, networksLoading } = useSelector((state) => state.network);

  const refreshWallet = () => {
    if (disableNavigation) return;
    navigator?.navigate?.('home', TABS.TOKENS);

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

  useEffect(() => {
    dispatch(getCurrentNetwork());
  }, []);
  return (
    <div className={classes.controls}>
      <div className={classes.networkSelector}>
        <div className={classes.statusDot} />
        {networksLoading ? 'Loading' : (
          <span className={classes.network}>{capitalize(currentNetwork?.name || 'Mainnet')}</span>
        )}
      </div>
      <div
        className={clsx(classes.reloadIconContainer, disableNavigation && classes.disabled)}
        onClick={refreshWallet}
      >
        <img src={RefreshAsset} alt="reload" className={classes.reloadIcon} />
      </div>
    </div>
  );
};

ConnectionControls.propTypes = {
  disableNavigation: PropTypes.bool,
};

ConnectionControls.defaultProps = {
  disableNavigation: false,
};

export default ConnectionControls;
