import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Actions,
  Tokens,
  Activity,
  Apps,
  Layout,
  useRouter,
  NFTs,
} from '@components';
import { Tabs } from '@ui';
import { HANDLER_TYPES, sendMessage, recursiveParseBigint } from '@background/Keyring';
import {
  setAccountInfo,
  addCollection,
  setCollections,
} from '@redux/wallet';

import { getBatchedNFTs } from '@psychedelic/dab-js';

import { useICPPrice } from '@redux/icp';
import { Principal } from '@dfinity/principal';

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigator, tabIndex } = useRouter();
  const {
    walletNumber, assetsLoading, collectionsLoading, transactionsLoading, optimisticNFTUpdate,
  } = useSelector((state) => state.wallet);

  const onChangeTab = (index) => {
    navigator.navigate('home', index);
  };

  useICPPrice(true);

  const tabs = useMemo(() => [
    {
      label: t('tabs.tokens'),
      component: <Tokens />,
      loading: assetsLoading,
    },
    {
      label: t('tabs.nfts'),
      component: <NFTs />,
      loading: collectionsLoading,
    },
    {
      label: t('tabs.activity'),
      component: <Activity />,
      loading: transactionsLoading,
    },
    {
      label: t('tabs.apps'),
      component: <Apps />,
    },
  ], [assetsLoading, collectionsLoading, transactionsLoading]);

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      if (!state?.wallets?.length) {
        sendMessage({ type: HANDLER_TYPES.LOCK, params: {} }, () => navigator.navigate('login'));
      } else {
        // Update cache
        sendMessage({
          type: HANDLER_TYPES.GET_NFTS,
          params: { refresh: true },
        }, (nftCollections) => {
          if (nftCollections?.length) {
            dispatch(setCollections({ collections: nftCollections, walletNumber }));
          }
        });
      }
      dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
    });
  }, []);

  return (
    <Layout>
      <Actions visible={tabIndex === 0} />
      <Tabs
        tabs={tabs}
        selectedTab={tabIndex}
        handleChangeTab={onChangeTab}
      />
    </Layout>
  );
};

export default Home;
