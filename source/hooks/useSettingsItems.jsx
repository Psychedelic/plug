import HelpIcon from '@assets/icons/help.png';
import KeyIcon from '@assets/icons/settings/old-key.svg';
import NotebookIcon from '@assets/icons/settings/notebook.svg';
import ArrowUpIcon from '@assets/icons/settings/arrow-up.svg';
import AntennaIcon from '@assets/icons/antenna.svg';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';

const useSettingsItems = () => {
  const { navigator } = useRouter();
  const { t } = useTranslation();

  return [
    {
      logo: NotebookIcon,
      name: t('settings.contacts'),
      description: t('settings.contactsDescription'),
      'data-testid': 'contact-book',
      onClick: (() => navigator.navigate('contacts')),
    },
    {
      logo: KeyIcon,
      name: t('settings.seedPhrase'),
      description: t('settings.seedPhraseDescription'),
      'data-testid': 'secret-recovery-phrase',
      onClick: (() => navigator.navigate('seed-phrase')),
    },
    {
      logo: AntennaIcon,
      name: t('settings.network'),
      description: t('settings.networkDescription'),
      'data-testid': 'network',
      onClick: (() => navigator.navigate('network')),
    },
    {
      logo: ArrowUpIcon,
      name: t('settings.exportIdentity'),
      description: t('settings.exportIdentityDescription'),
      'data-testid': 'export-dfx-identity',
      onClick: (() => navigator.navigate('export-identity')),
    },
    {
      logo: HelpIcon,
      name: t('profile.help'),
      description: t('settings.helpDescription'),
      'data-testid': 'help',
      onClick: () => navigator.navigate('help'),
    },
  ];
};

export default useSettingsItems;
