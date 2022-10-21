import LockIcon from '@assets/icons/lock.png';
import SettingsIcon from '@assets/icons/settings.png';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import extension from 'extensionizer';

const useMenuItems = () => {
  const { navigator } = useRouter();
  const { t } = useTranslation();

  return [
    {
      logo: SettingsIcon,
      name: 'Connect Hardware Wallet',
      alignLeft: true,
      onClick: async () => {
        extension.tabs.create({
          url: 'hardware-wallet.html',
        });
      },
      'data-testid': 'hardware-wallet-button',
    },
    {
      logo: SettingsIcon,
      name: t('profile.settings'),
      alignLeft: true,
      onClick: () => navigator.navigate('settings'),
      'data-testid': 'settings-button',
    },
    {
      logo: LockIcon,
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
