import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import extension from 'extensionizer';
import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import PropTypes from 'prop-types';
import useStyles from './styles';

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

const ConnectionStatus = ({ incStatus = null }) => {
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
      extension.storage.local.get('apps', (state) => {
        setStatus(state?.apps?.[activeTab]?.status || CONNECTION_STATUS.rejected);
      });
    }
  }, [activeTab]);

  if (!status) return null;

  const {
    icon,
    label,
    className,
  } = CONNECTION_CONFIG[status];

  return (
    <div className={clsx(classes.root, classes[className])}>
      {icon}
      <span>{t(label)}</span>
      {
        status === CONNECTION_STATUS.accepted
        && <span className={classes.web}>&nbsp;{activeTab}</span>
      }
    </div>
  );
};

export default ConnectionStatus;

ConnectionStatus.defaultProps = {
  incStatus: null,
};

ConnectionStatus.propTypes = {
  incStatus: PropTypes.string,
};
