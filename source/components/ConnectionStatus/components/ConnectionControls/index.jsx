import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize } from '@material-ui/core';
import { getTabURL } from '@shared/utils/chrome-tabs';
import extensionizer from 'extensionizer';
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
import { getApps } from '@modules/storageManager';
import { getCurrentNetwork, getNetworks } from '@redux/network';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { TABS, useRouter } from '@components/Router';
import RefreshAsset from '@assets/icons/refresh.svg';

import useStyles from './styles';
import NetworkSelector from '../NetworkSelector';

const ConnectionControls = ({ disableNavigation, hidden }) => {
  const classes = useStyles();
  const icpPrice = useICPPrice();
  const dispatch = useDispatch();
  const { getContacts } = useContacts();
  const { tabIndex } = disableNavigation ? {} : useRouter();
  const {
    principalId,
    walletId,
    assetsLoading,
    transactionsLoading,
    collectionsLoading,
  } = useSelector((state) => state.wallet);
  const { useICNS } = useSelector((state) => state.icns);
  const { currentNetwork } = useSelector((state) => state.network);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  const isTabInfoLoading = useMemo(() => {
    switch (tabIndex) {
      case TABS.TOKENS:
        return assetsLoading;
      case TABS.NFTS:
        return collectionsLoading;
      case TABS.ACTIVITY:
        return transactionsLoading;
      default:
        return assetsLoading || transactionsLoading || collectionsLoading;
    }
  }, [tabIndex, assetsLoading, transactionsLoading, collectionsLoading]);

  const refreshButtonInactive = isTabInfoLoading || disableNavigation;

  extensionizer.tabs.query({ active: true }, (tabs) => {
    const url = getTabURL(tabs?.[0]);
    // Check if new wallet is connected to the current page
    getApps(walletId, (apps) => {
      const isSiteConnected = !!apps?.[url];
      setConnected(isSiteConnected);
    });
  });

  const loadAssets = () => {
    dispatch(setAssetsLoading(true));
    sendMessage(
      {
        type: HANDLER_TYPES.GET_ASSETS,
        params: { refresh: true },
      },
      (keyringAssets) => {
        dispatch(setAssets({ keyringAssets, icpPrice }));
        dispatch(setAssetsLoading(false));
      },
    );
  };

  const loadTransactions = () => {
    dispatch(setTransactionsLoading(true));
    sendMessage(
      {
        type: HANDLER_TYPES.GET_TRANSACTIONS,
        params: {},
      },
      (trxs) => {
        dispatch(setTransactions({ ...trxs, icpPrice, useICNS }));
        dispatch(setTransactionsLoading(false));
      },
    );
  };

  const loadCollections = () => {
    dispatch(setCollectionsLoading(true));
    sendMessage(
      {
        type: HANDLER_TYPES.GET_NFTS,
        params: { refresh: true },
      },
      (nftCollections) => {
        if (nftCollections?.length) {
          dispatch(
            setCollections({ collections: nftCollections, principalId }),
          );
        }
        dispatch(setCollectionsLoading(false));
      },
    );
  };

  const refreshWallet = () => {
    if (refreshButtonInactive) return;

    if (icpPrice) {
      // Contacts
      getContacts(true);

      loadAssets();
      loadCollections();
      loadTransactions();
    }
  };

  useEffect(() => {
    dispatch(getCurrentNetwork());
    dispatch(getNetworks());
  }, []);

  return (
    !hidden && (
      <div className={classes.controls}>
        <div
          className={classes.networkSelector}
          onClick={() => setSelectorOpen(true)}
          data-testid="network-selector"
        >
          <div
            className={clsx(
              classes.controlsInfo,
              connected && classes.connectedControls,
            )}
          >
            <div className={clsx(classes.statusDot)} />
            <span className={classes.network} data-testid="current-network-name">
              {capitalize(currentNetwork?.name || 'Mainnet')}
            </span>
          </div>
        </div>
        <button
          type="button"
          data-testid="refresh-wallet-button"
          disabled={refreshButtonInactive}
          className={classes.reloadIconContainer}
          onClick={refreshWallet}
        >
          <img
            src={RefreshAsset}
            alt="reload"
            className={clsx(
              classes.reloadIcon,
              isTabInfoLoading && classes.reloadIconLoading,
            )}
          />
        </button>
        {selectorOpen && (
          <NetworkSelector
            onClose={() => setSelectorOpen(false)}
            refreshWallet={refreshWallet}
            data-testid="network-select-modal"
          />
        )}
      </div>
    )
  );
};

ConnectionControls.propTypes = {
  disableNavigation: PropTypes.bool,
  hidden: PropTypes.bool,
};

ConnectionControls.defaultProps = {
  disableNavigation: false,
  hidden: false,
};

export default ConnectionControls;
