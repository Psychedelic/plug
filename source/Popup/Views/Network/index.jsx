import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';

import { Layout } from '@components';
import { Header, LinkButton, Button } from '@ui';
import BackIcon from '@assets/icons/back.svg';
import AntennaIcon from '@assets/icons/antenna.svg';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import useStyles from './styles';

const Network = () => {
  const { t } = useTranslation();
  const { navigator } = useRouter();
  const classes = useStyles();
  const { networks = [] } = useSelector((state) => state.wallet);
  return (
    <Layout>
      <Header
        center={<Typography variant="h2">{t('network.network')}</Typography>}
        left={<LinkButton value={t('common.back')} onClick={navigator.goBack} startIcon={BackIcon} />}
        right={<LinkButton value={t('common.done')} onClick={() => navigator.navigate('tokens')} />}
      />
      <div className={classes.networkContainer}>
        {networks?.length
          ? networks.map((network) => (
            <div>
              <span>
                {network?.name}
              </span>

              <span>
                {network?.ledgerCID}
              </span>

              <span>
                {network?.host}
              </span>
            </div>
          ))
          : (
            <div className={classes.noNetworksContainer}>
              <img src={AntennaIcon} alt="network" className={classes.networkIcon} />
              <Typography variant="h3">{t('network.addNetwork')}</Typography>
              <Typography variant="subtitle2">{t('network.addNetworkDescription')}</Typography>
              <Button variant="rainbow" value={t('network.addNetwork')} onClick={() => navigator.navigate('create-network')} fullWidth />
            </div>
          )}
      </div>
    </Layout>
  );
};

export default Network;
