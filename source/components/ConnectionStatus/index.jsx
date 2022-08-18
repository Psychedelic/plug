import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import extension from 'extensionizer';
import PropTypes from 'prop-types';
import browser from 'webextension-polyfill';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { getAppsKey } from '@modules/storageManager';

import useStyles from './styles';
import ConnectionControls from './components/ConnectionControls';

const CONNECTION_CONFIG = {
  [CONNECTION_STATUS.accepted]: {
    icon: <CheckCircleIcon style={{ fontSize: 16, marginRight: 2 }} />,
    label: 'connectionStatus.plugged',
    className: 'active',
  },
  [CONNECTION_STATUS.rejected]: {
    icon: null,
    label: 'connectionStatus.alpha',
    className: 'rainbow',
  },
  [CONNECTION_STATUS.pending]: {
    icon: null,
    label: 'connectionStatus.incomingConnection',
    className: 'active',
  },
};

const beautifyUrl = (url) => (
  url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
);

const ConnectionStatus = ({ incStatus = null, disableNavigation, hideNetwork }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [status, setStatus] = useState(incStatus);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (!incStatus) {
      extension.tabs.query({ currentWindow: true, active: true },
        (res) => {
          setActiveTab(beautifyUrl(res[0].url));
        });
    }
  }, []);

  useEffect(() => {
    if (activeTab && !incStatus) {
      getAppsKey((state) => {
        setStatus(state?.apps?.[activeTab]?.status || CONNECTION_STATUS.rejected);
      });
    }
  }, [activeTab]);

  const {
    icon,
    label,
    className,
  } = CONNECTION_CONFIG[status || CONNECTION_STATUS.rejected];

  return (
    <div className={clsx(classes.root, classes[className])}>
      {icon}
      <span
        data-testid="banner-text"
        className={clsx(hideNetwork && classes.fullWidth, classes.bannerText)}
      >
        {t(label, { version: browser.runtime.getManifest().version })}
      </span>
      {
        status === CONNECTION_STATUS.accepted
        && <span className={classes.web}>&nbsp;{activeTab}</span>
      }
      <ConnectionControls hidden={hideNetwork} disableNavigation={disableNavigation} />
    </div>
  );
};

export default ConnectionStatus;

ConnectionStatus.defaultProps = {
  incStatus: null,
  disableNavigation: false,
  hideNetwork: false,
};

ConnectionStatus.propTypes = {
  incStatus: PropTypes.string,
  disableNavigation: PropTypes.bool,
  hideNetwork: PropTypes.bool,
};
