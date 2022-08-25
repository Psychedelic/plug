import React from 'react';
import { LinkButton } from '@components';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DabIcon from '@assets/icons/dab.svg';
import extension from 'extensionizer';
import { dabUrl, dabForm } from '@shared/constants/urls';
import useStyles from '../styles';

const DabInfo = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.dabTokenContainer}>
      <img
        src={DabIcon}
        className={classes.dabImage}
        onClick={() => extension.tabs.create({ url: dabUrl })}
      />
      <Typography variant="h3">{t('addToken.dabTitle')}</Typography>
      <Typography variant="subtitle1">{t('addToken.dabText')}</Typography>
      <LinkButton value={t('common.learnMore')} onClick={() => extension.tabs.create({ url: dabForm })} />
    </div>
  );
};

export default DabInfo;
