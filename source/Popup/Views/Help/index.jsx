import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Layout, Header, LinkButton, MenuItem,
} from '@components';
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
      <Header center={t('help.title')} right={<LinkButton value={t('common.close')} onClick={() => navigator.navigate('home')} />} />
      <div className={classes.menuContainer}>
        {
          helpItems.map((item) => (
            <MenuItem
              key={item.name}
              {...item}
              size="medium"
            />
          ))
        }
      </div>
    </Layout>
  );
};

export default Help;
