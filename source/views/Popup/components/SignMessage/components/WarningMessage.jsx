import React, { useState } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import warningIconSrc from '@assets/icons/yellow-warning.svg';
import chevronDownSrc from '@assets/icons/chevron-down.svg';
import initConfig from '../../../../../locales';

import useStyles from './styles';

i18n.use(initReactI18next).init(initConfig);

const WarningMessage = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const handleChevronClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`${classes.warningBoxContainer} ${expanded && classes.expandedWarningBox}`}>
      <div className={classes.warningHeader}>
        <div className={classes.warningHeaderLeft}>
          <img alt="warning-icon" className={classes.warningIcon} src={warningIconSrc} />
          <h3>
            Warning:
            <span> Risky Transaction</span>
          </h3>
        </div>
        <img
          alt="chevron-down"
          className={classes.chevronDown}
          onClick={handleChevronClick}
          src={chevronDownSrc}
        />
      </div>
      { expanded && (
        <p className={classes.expandedWarningText}>
          {t('signMessage.warningText')}
        </p>
      )}
    </div>
  );
};

export default WarningMessage;
