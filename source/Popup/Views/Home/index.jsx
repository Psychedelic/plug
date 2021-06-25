import React from 'react';
import {
  Actions, Assets, Activity, Layout,
} from '@components';
import { Tabs } from '@ui';
import { useTranslation } from 'react-i18next';
import { useTabs } from '@hooks';

const getTabs = (t) => [
  {
    label: t('tabs.assets'),
    component: <Assets />,
  },
  {
    label: t('tabs.activity'),
    component: <Activity />,
  },
  /*
  {
    label: t('tabs.apps'),
    component: <Apps />,
  },
  */
];

const Home = () => {
  const { t } = useTranslation();
  const { selectedTab, handleChangeTab } = useTabs();

  return (
    <Layout>
      <Actions />
      <Tabs tabs={getTabs(t)} selectedTab={selectedTab} handleChangeTab={handleChangeTab} />
    </Layout>
  );
};

export default Home;
