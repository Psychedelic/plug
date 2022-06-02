import { useDispatch, useSelector } from 'react-redux';
import LockIcon from '@assets/icons/lock.png';
import SettingsIcon from '@assets/icons/settings.png';
import RefreshIcon from '@assets/icons/refresh.png';
import { useTranslation } from 'react-i18next';
import { useRouter, TABS } from '@components/Router';
import { useICPPrice } from '@redux/icp';
import {
  setAssets,
  setAssetsLoading,
  setTransactions,
  setTransactionsLoading,
  setCollections,
  setCollectionsLoading,
} from '@redux/wallet';
import { getContacts } from '@redux/contacts';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

const useMenuItems = (toggleMenu) => {
  const { navigator } = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const icpPrice = useICPPrice();
  const { principalId } = useSelector((state) => state.wallet);
  const { useICNS } = useSelector((state) => state.icns);

  const refreshWallet = () => {
    navigator.navigate('home', TABS.TOKENS);
    toggleMenu();

    if (icpPrice) {
      // Contacts
      dispatch(getContacts(true));

      // NFTS
      dispatch(setCollectionsLoading(true));
      sendMessage({
        type: HANDLER_TYPES.GET_NFTS,
        params: { refresh: true },
      }, (nftCollections) => {
        if (nftCollections?.length) {
          dispatch(setCollections({ collections: nftCollections, principalId }));
        }
        dispatch(setCollectionsLoading(false));
      });

      // Transactions
      dispatch(setTransactionsLoading(true));
      sendMessage({
        type: HANDLER_TYPES.GET_TRANSACTIONS,
        params: {},
      }, (trxs) => {
        dispatch(setTransactions({ ...trxs, icpPrice, useICNS }));
        dispatch(setTransactionsLoading(false));
      });

      // Tokens
      dispatch(setAssetsLoading(true));
      sendMessage({
        type: HANDLER_TYPES.GET_ASSETS,
        params: { refresh: true },
      }, (keyringAssets) => {
        dispatch(setAssets({ keyringAssets, icpPrice }));
        dispatch(setAssetsLoading(false));
      });
    }
  };

  return [
    {
      image: SettingsIcon,
      name: t('profile.settings'),
      alignLeft: true,
      onClick: () => navigator.navigate('settings'),
      'data-testid': 'settings-button',
    },
    {
      image: RefreshIcon,
      name: t('profile.refreshWallet'),
      alignLeft: true,
      onClick: refreshWallet,
      'data-testid': 'refresh-wallet-button',
    },
    {
      image: LockIcon,
      name: t('profile.lock'),
      alignLeft: true,
      onClick: (() => {
        sendMessage({ type: HANDLER_TYPES.LOCK, params: {} }, () => {
          navigator.navigate('login');
        });
      }),
      'data-testid': 'lock-button',
    },
  ];
};

export default useMenuItems;
