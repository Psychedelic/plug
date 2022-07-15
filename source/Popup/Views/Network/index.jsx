import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { TABS, useRouter } from '@components/Router';

import { CircularProgress, Typography } from '@material-ui/core';
import { getNetworks } from '@redux/network';
import BackIcon from '@assets/icons/back.svg';
import { Header, LinkButton } from '@ui';
import { Layout } from '@components';

import useStyles from './styles';
import NoNetworks from './components/NoNetworks';
import NetworkCard from './components/NetworkCard';

const Network = () => {
  const { t } = useTranslation();
  const { navigator } = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { networks = [], networksLoading } = useSelector((state) => state.network);

  const navigateTo = (screen, tab) => () => navigator.navigate(screen, tab);

  useEffect(() => {
    dispatch(getNetworks());
  }, []);

  return (
    <Layout>
      <Header
        center={<Typography variant="h2">{t('network.network')}</Typography>}
        left={<LinkButton value={t('common.back')} onClick={navigator.goBack} startIcon={BackIcon} />}
        right={<LinkButton value={t('common.done')} onClick={navigateTo('home', TABS.TOKENS)} />}
      />
      {networksLoading ? <CircularProgress size={24} />
        : (
          <div className={classes.networkContainer}>
            {networks?.length
              ? networks.map((network) => (<NetworkCard {...network} />))
              : (<NoNetworks />)}
          </div>
        )}
      <div
        onClick={navigateTo('create-network')}
        className={classes.addNetwork}
      >
        <Plus size="30" className={classes.plusIcon} strokeWidth={2.5} />
      </div>
    </Layout>
  );
};

export default Network;
