import React, { useEffect } from 'react';
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
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import {
  setAccountInfo,
  addCollection,
  setCollectionsLoading,
  setCollections,
} from '@redux/wallet';

import { getBatchedNFTs } from '@psychedelic/dab-js';

import { useICPPrice } from '@redux/icp';

const getTabs = (t) => [
  {
    label: t('tabs.tokens'),
    component: <Tokens />,
  },
  {
    label: t('tabs.nfts'),
    component: <NFTs />,
  },
  {
    label: t('tabs.activity'),
    component: <Activity />,
  },
  {
    label: t('tabs.apps'),
    component: <Apps />,
  },
];

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigator, tabIndex } = useRouter();
  const { walletNumber } = useSelector((state) => state.wallet);

  const onChangeTab = (index) => {
    navigator.navigate('home', index);
  };

  useICPPrice(true);

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      if (!state?.wallets?.length) {
        sendMessage({ type: HANDLER_TYPES.LOCK, params: {} }, () => navigator.navigate('login'));
      } else {
        // Update cache
        sendMessage({
          type: HANDLER_TYPES.GET_NFTS,
          params: {},
        }, (nftCollections) => {
          dispatch(setCollections({ collections: nftCollections, walletNumber }));
          dispatch(setCollectionsLoading(false));
        });
        getBatchedNFTs({
          principal: state?.wallets?.[state?.currentWalletId].principal,
          callback: (collection) => {
            if (collection) {
              dispatch(addCollection({ collection, walletNumber }));
              dispatch(setCollectionsLoading(false));
            }
          },
        });
      }
      dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
    });
  }, []);

  return (
    <Layout>
      <Actions visible={tabIndex === 0} />
      <Tabs
        tabs={getTabs(t)}
        selectedTab={tabIndex}
        handleChangeTab={onChangeTab}
      />
    </Layout>
  );
};

export default Home;
