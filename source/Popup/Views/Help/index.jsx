import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@components';
import { Header, LinkButton, MenuItem } from '@ui';
import { useRouter } from '@components/Router';
import useHelpItems from '../../../hooks/useHelpItems';
import useStyles from './styles';

const Help = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { navigator } = useRouter();
  const helpItems = useHelpItems();
  return (
    <Layout>
      <Header value={t('help.title')} right={<LinkButton value={t('common.close')} onClick={() => navigator.navigate('home')} />} />
      <div className={classes.menuContainer}>
        {
          helpItems.map((item) => (
            <MenuItem {...item} isBig />
          ))
        }
      </div>
    </Layout>
  );
};

export default Help;
