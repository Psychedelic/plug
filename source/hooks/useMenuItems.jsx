import { useState, useEffect } from 'react';
import HelpIcon from '@assets/icons/help.png';
import SettingsIcon from '@assets/icons/settings.png';
import { useTranslation } from 'react-i18next';

const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setMenuItems([
      {
        image: SettingsIcon,
        name: t('profile.settings'),
        onClick: (() => null),
      },
      {
        image: HelpIcon,
        name: t('profile.help'),
        onClick: (() => null),
      },
    ]);
  }, []);

  return { menuItems };
};

export default useMenuItems;
