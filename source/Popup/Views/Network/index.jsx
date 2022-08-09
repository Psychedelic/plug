import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { TABS, useRouter } from '@components/Router';

import { Typography } from '@material-ui/core';
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
  const { networks = [] } = useSelector((state) => state.network);
  const [groupedNetworks, setGroupedNetworks] = useState({});

  const navigateTo = (screen, tab) => () => navigator.navigate(screen, tab);

  useEffect(() => {
    dispatch(getNetworks());
  }, []);

  useEffect(() => {
    // Group networks by first letter of name
    const networksByName = networks.reduce((acc, network) => {
      const letter = network.name?.[0]?.toUpperCase?.();
      const letterNetworks = acc[letter] || [];
      return {
        ...acc,
        [letter]: [...letterNetworks, network].sort(
          (a, b) => a.name.toUpperCase() > b.name.toUpperCase(),
        ),
      };
    }, {});
    setGroupedNetworks(networksByName);
  }, [networks]);

  return (
    <Layout>
      <Header
        center={<Typography variant="h2">{t('network.network')}</Typography>}
        left={<LinkButton value={t('common.back')} onClick={navigator.goBack} startIcon={BackIcon} />}
        right={<LinkButton value={t('common.done')} onClick={navigateTo('home', TABS.TOKENS)} />}
      />
      {networks?.length ? (
        <div className={classes.networkContainer}>
          {Object.keys(groupedNetworks).sort().map(
            (letter) => (
              <>
                <div className={classes.letterHeader}>
                  {letter}
                </div>
                {groupedNetworks[letter].map((network, index) => (
                  <>
                    <NetworkCard {...network} />
                    {index < groupedNetworks[letter].length - 1 && (
                      <div className={classes.divider} />
                    )}
                  </>
                ))}
              </>
            ),
          )}
        </div>
      ) : <NoNetworks />}
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
