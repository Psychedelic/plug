import React from 'react';
import { Layout } from '@components';
import { Header, LinkButton, MenuItem } from '@ui';
import { useRouter } from '@components/Router';
import useHelpItems from '../../../hooks/useHelpItems';
import useStyles from './styles';

const Help = () => {
  const classes = useStyles();
  const { navigator } = useRouter();
  const { helpItems } = useHelpItems();
  return (
    <Layout>
      <Header value="Help" right={<LinkButton value="Close" onClick={() => navigator.navigate('home')} />} />
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
