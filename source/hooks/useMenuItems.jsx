import HelpIcon from '@assets/icons/help.png';
import LockIcon from '@assets/icons/lock.png';
import SettingsIcon from '@assets/icons/settings.png';
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
      image: HelpIcon,
      name: t('profile.help'),
      onClick: () => navigator.navigate('help'),
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
