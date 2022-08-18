import React, { useEffect, useMemo, useState } from 'react';
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
  ConnectAccountsModal,
} from '@components';
import { Tabs } from '@ui';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { setAccountInfo } from '@redux/wallet';
import { useICPPrice } from '@redux/icp';
import { setUseICNS } from '@redux/icns';
import { isClockInSync } from '@shared/utils/time';
import { getApp, getUseICNS, getWalletsConnectedToUrl } from '@modules/storageManager';
import { getTabURL } from '@shared/utils/chrome-tabs';
import extension from 'extensionizer';

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigator, tabIndex } = useRouter();
  const {
    assetsLoading, collectionsLoading, transactionsLoading, walletNumber,
  } = useSelector((state) => state.wallet);
  const { usingMainnet } = useSelector((state) => state.network);

  const { clockValidated } = useSelector((state) => state.clock);
  const [wallets, setWallets] = useState([]);
  const [isConnectAccountsOpen, setConnectAccountsOpen] = useState(false);
  const [connectedWallets, setConnectedWallets] = useState([]);

  const [app, setApp] = useState(null);
  const [tab, setTab] = useState(null);

  const onChangeTab = (index) => {
    navigator.navigate('home', index);
  };

  useICPPrice(true);

  const tabs = useMemo(() => [
    {
      label: t('tabs.tokens'),
      component: <Tokens />,
      loading: assetsLoading,
      disabled: false,
    },
    {
      label: t('tabs.nfts'),
      component: <NFTs />,
      loading: collectionsLoading,
      disabled: !usingMainnet,
    },
    {
      label: t('tabs.activity'),
      component: <Activity />,
      loading: transactionsLoading,
      disabled: !usingMainnet,
    },
    {
      label: t('tabs.apps'),
      component: <Apps />,
      disabled: !usingMainnet,
    },
  ], [assetsLoading, collectionsLoading, transactionsLoading, usingMainnet]);

  const validateProviderConnection = (state) => {
    extension.tabs.query({ active: true, lastFocusedWindow: true }, (browserTabs) => {
      const currentTab = browserTabs?.[0];
      const url = getTabURL(currentTab);
      const ids = state.wallets.map((_, idx) => idx);
      setTab(currentTab);
      getWalletsConnectedToUrl(url, ids, (_connectedWallets = []) => {
        setConnectedWallets(_connectedWallets);
        if (_connectedWallets.length > 0) {
          getApp(walletNumber.toString(), url, (currentApp) => {
            setApp(currentApp);
            const isConnected = _connectedWallets.includes(state.currentWalletId);
            if (!isConnected) {
              setConnectAccountsOpen(true);
            }
          });
        }
      });
    });
  };

  const updateProviderConnection = async () => {
    const currentWallet = wallets?.[walletNumber] || null;
    if (currentWallet) {
      extension.tabs.query({ active: true }, (activeTabs) => {
        extension.tabs.sendMessage(activeTabs[0].id, { action: 'updateConnection' });
      });
    }
  };

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      if (!state?.wallets?.length) {
        sendMessage({ type: HANDLER_TYPES.LOCK, params: {} }, () => navigator.navigate('login'));
      } else if (!clockValidated) {
        isClockInSync().then((isInSync) => !isInSync && navigator.navigate('clockError'));
      }
      setWallets(state?.wallets);
      dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
      validateProviderConnection(state);
    });
  }, [clockValidated]);

  useEffect(() => {
    getUseICNS(walletNumber, (useICNS) => {
      dispatch(setUseICNS(useICNS));
    });
  }, [walletNumber]);
  return (
    <Layout>
      <Actions visible={tabIndex === 0} />
      <Tabs
        tabs={tabs}
        selectedTab={tabIndex}
        handleChangeTab={onChangeTab}
        tabItemTestId="tab-item"
      />
      <ConnectAccountsModal
        wallets={wallets}
        open={isConnectAccountsOpen}
        onClose={() => setConnectAccountsOpen(false)}
        onConfirm={updateProviderConnection}
        connectedWallets={connectedWallets}
        app={app}
        tab={tab}
      />
    </Layout>
  );
};

export default Home;
