import HelpIcon from '@assets/icons/help.png';
import KeyIcon from '@assets/icons/settings/old-key.svg';
import NotebookIcon from '@assets/icons/settings/notebook.svg';
import ArrowUpIcon from '@assets/icons/settings/arrow-up.svg';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';

const useSettingsItems = () => {
  const { navigator } = useRouter();
  const { t } = useTranslation();

  return [
    {
      image: NotebookIcon,
      name: t('settings.contacts'),
      description: t('settings.contactsDescription'),
      onClick: (() => navigator.navigate('contacts')),
    },
    {
      image: KeyIcon,
      name: t('settings.seedPhrase'),
      description: t('settings.seedPhraseDescription'),
      onClick: (() => navigator.navigate('seed-phrase')),
    },
    {
      image: ArrowUpIcon,
      name: t('settings.exportIdentity'),
      description: t('settings.exportIdentityDescription'),
      onClick: (() => navigator.navigate('export-identity')),
    },
    {
      image: HelpIcon,
      name: t('profile.help'),
      description: t('settings.helpDescription'),
      onClick: () => navigator.navigate('help'),
    },
  ];
};

export default useSettingsItems;
