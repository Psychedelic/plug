import LockIcon from '@assets/icons/lock.png';
import SettingsIcon from '@assets/icons/settings.png';
import RefreshIcon from '@assets/icons/refresh.png';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

const useMenuItems = () => {
  const { navigator } = useRouter();
  const { t } = useTranslation();

  return [
    {
      image: SettingsIcon,
      name: t('profile.settings'),
      alignLeft: true,
      onClick: () => navigator.navigate('settings'),
    },
    {
      image: RefreshIcon,
      name: t('profile.refreshWallet'),
      alignLeft: true,
      onClick: () => null,
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
    },
  ];
};

export default useMenuItems;
