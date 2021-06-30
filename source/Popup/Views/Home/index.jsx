import React, { useEffect } from 'react';
import {
  Actions, Assets, Activity, Apps, Layout,
} from '@components';
import { Tabs } from '@ui';
import { useTranslation } from 'react-i18next';
import { useTabs } from '@hooks';
import { useDispatch } from 'react-redux';
import { getData } from '../../../redux/wallet';

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
    dispatch(getData());
  }, []);

  return (
    <Layout>
      <Actions />
      <Tabs tabs={getTabs(t)} selectedTab={selectedTab} handleChangeTab={handleChangeTab} />
    </Layout>
  );
};

export default Home;
