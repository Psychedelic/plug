import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons/faExclamationTriangle';
import clsx from 'clsx';
import useStyles from './styles';

const getIcon = (classes) => ({
  warning: <FontAwesomeIcon
    icon={faExclamationTriangle}
    className={clsx(classes.icon, classes.warningIcon)}
  />,
});

const Alert = ({ type, value }) => {
  const classes = useStyles();

  const icon = getIcon(classes)[type];

  return (
    <div className={clsx(classes.root, classes[type])}>
      {icon}
      {value}
    </div>
  );
};

export default Alert;

Alert.propTypes = {
  type: PropTypes.oneOf(['warning']).isRequired,
  value: PropTypes.string.isRequired,
};
