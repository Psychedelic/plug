import React from 'react';
import DabIcon from '@assets/icons/dab.svg';
import { dabUrl } from '@shared/constants/urls';
import extension from 'extensionizer';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';

const PoweredByDab = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container} onClick={() => extension.tabs.create({ url: dabUrl })}>
      <img
        src={DabIcon}
        className={classes.dabImage}
      />
      <span className={classes.poweredByDab}>{t('dab.poweredByDab')}</span>
    </div>
  );
};

export default PoweredByDab;
