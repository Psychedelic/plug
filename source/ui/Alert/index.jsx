import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons/faExclamationTriangle';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle';
import clsx from 'clsx';
import useStyles from './styles';

const ICONS = {
  warning: faExclamationTriangle,
  danger: faInfoCircle,
};

const Alert = ({
  type, value, startIcon, endIcon, url,
}) => {
  const classes = useStyles();

  const icon = (
    <FontAwesomeIcon
      icon={ICONS[type]}
      className={
      clsx(
        classes.icon,
        classes[`icon${type}`],
        startIcon ? classes.startIcon : classes.endIcon,
      )
    }
      onClick={() => (url ? window.open(url, '_blank') : null)}
    />
  );

  return (
    <div className={clsx(classes.root, classes[type])}>
      {startIcon && icon}
      {value}
      {endIcon && icon}
    </div>
  );
};

export default Alert;

Alert.defaultProps = {
  startIcon: false,
  endIcon: false,
  url: null,
};

Alert.propTypes = {
  type: PropTypes.oneOf(['warning']).isRequired,
  value: PropTypes.string.isRequired,
  startIcon: PropTypes.bool,
  endIcon: PropTypes.bool,
  url: PropTypes.string,
};
