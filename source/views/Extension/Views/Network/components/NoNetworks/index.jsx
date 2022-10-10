import React from 'react';
import { useTranslation } from 'react-i18next';

import AntennaIcon from '@assets/icons/antenna.svg';
import { Typography } from '@material-ui/core';
import { useRouter } from '@components/Router';
import { Button } from '@components';

import useStyles from './styles';

const NoNetworks = () => {
  const { t } = useTranslation();
  const { navigator } = useRouter();
  const classes = useStyles();

  const goToCreateNetwork = () => navigator.navigate('create-network');

  return (
    <div className={classes.noNetworksContainer}>
      <img src={AntennaIcon} alt="network" className={classes.networkIcon} />
      <Typography  variant="h3">{t('network.addNetwork')}</Typography>
      <Typography variant="subtitle2">{t('network.addNetworkDescription')}</Typography>
      <Button variant="rainbow" value={t('network.addNetwork')} onClick={goToCreateNetwork} fullWidth />
    </div>
  );
};

export default NoNetworks;
