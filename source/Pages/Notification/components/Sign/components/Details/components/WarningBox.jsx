import React from 'react';
import { useTranslation } from 'react-i18next';

import YellowWarning from '@assets/icons/yellow-warning.svg';
import useStyles from '../styles';

const WarningBox = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.warningBox}>
      <img
        src={YellowWarning}
        className={classes.yellowWarningIcon}
        alt="warning-icon"
      />
      <p className={classes.warningTitle}>
        {t('sign.warning.title')}
      </p>
      <p className={classes.warningDescription}>
        {t('sign.warning.description')}
      </p>
      <p className={classes.warningLine}>
        Safety Tip: <span className={classes.warningLink}>Learn</span>,
        <span className={classes.warningLink}>talk</span>, or
        <span className={classes.warningLink}>tweet about it</span>
      </p>
    </div>
  );
};

export default WarningBox;
