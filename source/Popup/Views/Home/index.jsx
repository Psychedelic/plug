import React from 'react';
import { Actions } from '@components';
import { Tabs } from '@ui';

const TABS = [
  {
    label: 'Assets',
    component: <div>assets</div>,
  },
  {
    label: 'Activity',
    component: <div>activity</div>,
  },
  {
    label: 'Apps',
    component: <div>apps</div>,
  },
];

const Home = () => (
  <>
    <Actions />
    <Tabs tabs={TABS} />
  </>
);

export default Home;
