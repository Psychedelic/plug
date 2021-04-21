import { useState, useEffect } from 'react';
import PenIcon from '@assets/icons/settings/pen.svg';
import KeyIcon from '@assets/icons/settings/old-key.svg';
import HeartIcon from '@assets/icons/settings/broken-heart.svg';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';

const useSettingsItems = () => {
  const { navigator } = useRouter();
  const [settingsItems, setSettingsItems] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setSettingsItems([
      {
        image: PenIcon,
        name: t('settings.walletName'),
        description: t('settings.walletNameDescription'),
        onClick: (() => navigator.navigate('wallet-name')),
      },
      {
        image: KeyIcon,
        name: t('settings.seedPhrase'),
        description: t('settings.seedPhraseDescription'),
        onClick: (() => navigator.navigate('seed-phrase')),
      },
      {
        image: HeartIcon,
        name: t('settings.resetAccount'),
        description: t('settings.resetAccountDescription'),
        onClick: (() => navigator.navigate('reset-account')),
      },
    ]);
  }, []);

  return { settingsItems };
};

export default useSettingsItems;
