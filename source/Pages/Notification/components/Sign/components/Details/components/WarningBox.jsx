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
        <span className={classes.warningInfo}>Safety Tip:</span>
        <a className={classes.warningLink} target="_blank" href="https://docs.plugwallet.ooo/resources/app-trust-and-security/" rel="noreferrer">Learn,</a>
        <a className={classes.warningLink} target="_blank" href="https://discord.gg/fleekhq" rel="noreferrer">talk,</a>
        <span className={classes.warningInfo}>or</span>
        <a className={classes.warningLink} target="_blank" href="https://twitter.com/intent/tweet?text=Hey! I want to talk about security!" rel="noreferrer">tweet about it</a>
      </p>
    </div>
  );
};

export default WarningBox;
