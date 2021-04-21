import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import { Layout } from '@components';
import { MenuItemDetailed, Header, LinkButton } from '@ui';
import useSettingsItems from '../../../hooks/useSettingsItems';

const Settings = () => {
  const { settingsItems } = useSettingsItems();
  const { navigator } = useRouter();
  const { t } = useTranslation();

  return (
    <Layout>
      <Header value={t('settings.title')} right={<LinkButton value={t('common.close')} onClick={() => navigator.navigate('home')} />} />
      <div>
        {
          settingsItems.map((item) => (
            <MenuItemDetailed {...item} />
          ))
        }
      </div>
    </Layout>
  );
};

export default Settings;
