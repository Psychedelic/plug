import React from 'react';
import {
  Actions, Assets, Activity, Apps, Layout,
} from '@components';
import { Tabs } from '@ui';
import { useTranslation } from 'react-i18next';

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
  return (
    <Layout>
      <Actions />
      <Tabs tabs={getTabs(t)} />
    </Layout>
  );
};

export default Home;
