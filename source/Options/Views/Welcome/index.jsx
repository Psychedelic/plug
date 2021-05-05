import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Plug } from '@components';
import { FullscreenContainer, ActionCard } from '@ui';
import { Typography } from '@material-ui/core';
import ImportImg from '@assets/icons/options/importwallet.svg';
import CreateImg from '@assets/icons/options/createwallet.svg';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';

const Welcome = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <FullscreenContainer>
      <Grid container spacing={4}>

        <Grid item xs={12} className={classes.titleContainer}>
          <Plug size="big" message={t('welcome.plug1')} style={{ marginBottom: 24 }} />
          <Typography variant="h2">{t('welcome.welcomeTitle')}</Typography>
          <Typography variant="subtitle1">{t('welcome.welcomeSubtitle')}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <ActionCard icon={ImportImg} title={t('welcome.importWallet')} subtitle={t('welcome.importText')} button={t('welcome.importWallet')} onClick={() => null} />
        </Grid>

        <Grid item xs={12} md={6}>
          <ActionCard icon={CreateImg} title={t('welcome.createWallet')} subtitle={t('welcome.createText')} button={t('welcome.createWallet')} onClick={() => null} />
        </Grid>

      </Grid>

    </FullscreenContainer>
  );
};

export default Welcome;
