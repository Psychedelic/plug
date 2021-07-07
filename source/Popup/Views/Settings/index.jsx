import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import { Layout } from '@components';
import { MenuItemDetailed, Header, LinkButton } from '@ui';
import useSettingsItems from '../../../hooks/useSettingsItems';
import useStyles from './styles';

const Settings = () => {
  const classes = useStyles();
  const settingsItems = useSettingsItems();
  const { navigator } = useRouter();
  const { t } = useTranslation();

  return (
    <Layout>
      <Header
        center={t('settings.title')}
        right={(
          <LinkButton
            value={t('common.close')}
            onClick={() => navigator.navigate('home')}
          />
        )}
        className={classes.title}
      />
      <div>
        {
          settingsItems.map((item) => (
            <MenuItemDetailed key={item.name} {...item} />
          ))
        }
      </div>
    </Layout>
  );
};

export default Settings;
