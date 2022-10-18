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
  Tabs,
} from '@components';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { setAccountInfo } from '@redux/wallet';
import { useICPPrice } from '@redux/icp';
import { setUseICNS } from '@redux/icns';
import { isClockInSync } from '@shared/utils/time';
import { getTabURL } from '@shared/utils/chrome-tabs';
import extension from 'extensionizer';
import {
  getApp,
  getUseICNS,
  getWalletsConnectedToUrl,
  updateWalletId,
} from '@modules/storageManager';

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigator, tabIndex } = useRouter();
  const {
    assetsLoading, collectionsLoading, transactionsLoading, walletId,
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
      const ids = Object.values(state.wallets).map((account) => account.walletId);
      setTab(currentTab);
      getWalletsConnectedToUrl(url, ids, (_connectedWallets = []) => {
        setConnectedWallets(_connectedWallets);
        if (_connectedWallets.length > 0) {
          getApp(walletId, url, (currentApp) => {
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

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} }, (state) => {
      const migratedWalletId = state.walletIds ? true : false;
      if (!Object.keys(state?.wallets).length) {
        sendMessage({ type: HANDLER_TYPES.LOCK, params: {} }, () => navigator.navigate('login'));
      } else if (!clockValidated) {
        isClockInSync().then((isInSync) => !isInSync && navigator.navigate('clockError'));
        validateProviderConnection(state);
      } else if (!migratedWalletId) {
        Object.values(state.wallets).forEach((wallet) => {
          updateWalletId(wallet.walletNumber, wallet.walletId);
        }); 
      }

      setWallets(Object.values(state?.wallets));
      dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
      validateProviderConnection(state);
    });
  }, [clockValidated]);

  useEffect(() => {
    getUseICNS(walletId, (useICNS) => {
      dispatch(setUseICNS(useICNS));
    });
  }, [walletId]);

  useEffect(() => {
    sendMessage({ type: HANDLER_TYPES.GET_STATE, params: {} },
      (state) => {
        const walletsArray = Object.values(state?.wallets);
        if (walletsArray?.length) {
          setWallets(walletsArray);
        }
      });
  }, []);

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
        connectedWallets={connectedWallets}
        app={app}
        tab={tab}
      />
    </Layout>
  );
};

export default Home;
