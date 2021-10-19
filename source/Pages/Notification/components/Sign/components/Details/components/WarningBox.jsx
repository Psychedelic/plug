import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import YellowWarning from '@assets/icons/yellow-warning.svg';
import useStyles from '../styles';

const links = {
  twitter: (url, canisterName) => `https://twitter.com/intent/tweet?text=Hey ${url}. Interacting with ${canisterName} on your app feels unsafe (I can't see all the info). Can you please fix this 🙏`,
  discord: 'https://discord.gg/fleekhq',
  docs: 'https://docs.plugwallet.ooo/resources/app-trust-and-security/',
};

const WarningBox = ({ pageUrl, canisterName, canisterId }) => {
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
        <a className={classes.warningLink} target="_blank" href={links.docs} rel="noreferrer">Learn,</a>
        <a className={classes.warningLink} target="_blank" href={links.discord} rel="noreferrer">talk,</a>
        <span className={classes.warningInfo}>or</span>
        <a className={classes.warningLink} target="_blank" href={links.twitter(pageUrl, canisterName || canisterId)} rel="noreferrer">tweet about it</a>
      </p>
    </div>
  );
};

WarningBox.propTypes = {
  pageUrl: PropTypes.string.isRequired,
  canisterId: PropTypes.string.isRequired,
  canisterName: PropTypes.string,
};

WarningBox.defaultProps = {
  canisterName: null,
};

export default WarningBox;
