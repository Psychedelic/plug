import { Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CryingEmoji from '@assets/icons/crying.png';
import { plugDocs } from '@shared/constants/urls';
import useStyles from '../styles';

const EmptyState = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.emptyState}>
      <img src={CryingEmoji} className={classes.image} />
      <Typography variant="h4">{t('apps.emptyTitle')}</Typography>
      <Typography variant="subtitle2">
        {t('apps.emptyText')}
        &nbsp;
        <span className={classes.link} onClick={() => window.open(plugDocs, '_blank')}>{t('apps.emptyLink')}</span>
      </Typography>
    </div>
  );
};

export default EmptyState;
