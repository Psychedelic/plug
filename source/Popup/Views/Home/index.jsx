import React from 'react';
import { Actions } from '@components';
import { Tabs } from '@ui';
import { useTranslation } from 'react-i18next';

const getTabs = (t) => [
  {
    label: t('tabs.assets'),
    component: <div>assets</div>,
  },
  {
    label: t('tabs.activity'),
    component: <div>activity</div>,
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
