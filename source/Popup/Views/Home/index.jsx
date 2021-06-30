import React, { useEffect } from 'react';
import extension from 'extensionizer';
import {
  Actions, Assets, Activity, Apps, Layout,
} from '@components';
import { Tabs } from '@ui';
import { useTranslation } from 'react-i18next';
import { useTabs } from '@hooks';
import { useDispatch } from 'react-redux';
import { setAccountInfo } from '../../../redux/wallet';

const getTabs = (t) => [
  {
    label: t('tabs.assets'),
    component: <Assets />,
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
  const { selectedTab, handleChangeTab } = useTabs();
  const dispatch = useDispatch();

  useEffect(() => {
    extension.runtime.sendMessage({ type: 'get-keyring-state', params: {} },
      (state) => {
        console.log('home state', state);
        dispatch(setAccountInfo(state.wallets[0]));
      });
  }, []);

  return (
    <Layout>
      <Actions />
      <Tabs tabs={getTabs(t)} selectedTab={selectedTab} handleChangeTab={handleChangeTab} />
    </Layout>
  );
};

export default Home;
