import React from 'react';
import { LinkButton } from '@ui';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DabIcon from '@assets/icons/dab.svg';
import browser from 'webextension-polyfill';
import { dabUrl, dabForm } from '@shared/constants/urls';
import useStyles from '../styles';

const DabComingSoon = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.dabTokenContainer}>
      <div className={classes.comingSoon}>{t('addToken.comingSoon')}</div>
      <img
        src={DabIcon}
        className={classes.dabImage}
        onClick={() => browser.tabs.create({ url: dabUrl })}
      />
      <Typography variant="h3">{t('addToken.dabTitle')}</Typography>
      <Typography variant="subtitle1">{t('addToken.dabText')}</Typography>
      <LinkButton value={t('common.learnMore')} onClick={() => browser.tabs.create({ url: dabForm })} />
    </div>
  );
};

export default DabComingSoon;
