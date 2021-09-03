import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Actions, Tokens, Activity, Apps, Layout, useRouter, NFTs,
} from '@components';
import { Tabs } from '@ui';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import getICPPrice from '@shared/services/ICPPrice';
import { setAccountInfo } from '@redux/wallet';
import { setICPPrice } from '@redux/icp';

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

  const onChangeTab = (index) => {
    navigator.navigate('home', index);
  };

  useEffect(() => {
    try {
      // TODO: handle error gracefully
      // what to do when API price is unavailable?
      getICPPrice()
        .then(({ data }) => {
          dispatch(
            setICPPrice(data['internet-computer'].usd),
          );
        });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }

    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} },
      (state) => {
        if (!state?.wallets?.length) {
          sendMessage({ type: HANDLER_TYPES.LOCK, params: {} },
            () => navigator.navigate('login'));
        }
        dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
      });
  }, []);

  return (
    <Layout>
      <Actions visible={tabIndex === 0} />
      <Tabs tabs={getTabs(t)} selectedTab={tabIndex} handleChangeTab={onChangeTab} />
    </Layout>
  );
};

export default Home;
