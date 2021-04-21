import HelpIcon from '@assets/icons/help.png';
import SettingsIcon from '@assets/icons/settings.png';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';

const useMenuItems = () => {
  const { navigator } = useRouter();
  const { t } = useTranslation();

  return [
    {
      image: SettingsIcon,
      name: t('profile.settings'),
      onClick: () => navigator.navigate('settings'),
    },
    {
      image: HelpIcon,
      name: t('profile.help'),
      onClick: () => navigator.navigate('help'),
    },
  ];
};

export default useMenuItems;
