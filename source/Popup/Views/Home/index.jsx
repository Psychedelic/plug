import React from 'react';
import { Actions, Assets, Activity } from '@components';
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
    component: <div>apps</div>,
  },
];

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <Actions />
      <Tabs tabs={getTabs(t)} />
    </>
  );
};

export default Home;
