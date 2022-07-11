import { Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ThinkingEmoji from '@assets/icons/thinking-emoji.svg';
import useStyles from '../styles';

const EmptyState = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.emptyState}>
      <img src={ThinkingEmoji} className={classes.image} />
      <Typography className={classes.emptyTitle} variant="h4" data-testid="no-nft-title">{t('nfts.emptyTitle')}</Typography>
      <Typography className={classes.emptyText} variant="subtitle2">{t('nfts.emptyText')}</Typography>
    </div>
  );
};

export default EmptyState;
