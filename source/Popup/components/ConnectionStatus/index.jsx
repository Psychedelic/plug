import React from 'react';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import useStyles from './styles';

const CONNECTION_CONFIG = {
  plugged: (t, web) => ({
    icon: <CheckCircleIcon style={{ fontSize: 16, marginRight: 2 }} />,
    label: t('connectionStatus.plugged', { web: web }),
    className: 'active',
  }),
  notPlugged: (t) => ({
    icon: null,
    label: t('connectionStatus.notPlugged'),
    className: 'inactive',
  }),
  incomingConnection: (t) => ({
    icon: null,
    label: t('connectionStatus.incomingConnection'),
    className: 'active',
  }),
};

const ConnectionStatus = ({ status, web }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    icon,
    label,
    className,
  } = CONNECTION_CONFIG[status](t, web);

  return (
    <div className={clsx(classes.root, classes[className])}>
      {icon}
      {label}
    </div>
  );
};

export default ConnectionStatus;

ConnectionStatus.defaultProps = {
  web: null,
};

ConnectionStatus.propTypes = {
  status: PropTypes.oneOf(['plugged', 'notPlugged', 'incomingConnection']).isRequired,
  web: PropTypes.string,
};
