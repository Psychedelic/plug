import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Actions, Assets, Activity, Apps, Layout, useRouter,
} from '@components';
import { Tabs } from '@ui';
import { useTabs } from '@hooks';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import getICPPrice from '@shared/services/ICPPrice';
import { setAccountInfo } from '@redux/wallet';
import { setICPPrice } from '@redux/icp';

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
  const { navigator } = useRouter();

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
