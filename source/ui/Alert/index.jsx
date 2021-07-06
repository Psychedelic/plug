import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { AlertTriangle, AlertCircle } from 'react-feather';
import useStyles from './styles';

const Alert = ({
  type, // warning, danger, info
  title,
  subtitle,
  startIcon,
  endIcon,
  url,
}) => {
  const classes = useStyles();

  const icon = (name) => {
    const Icon = name === 'warning' ? AlertTriangle : AlertCircle;
    return (
      <Icon
        className={
          clsx(
            classes.icon,
            classes[`icon${type}`],
            startIcon ? classes.startIcon : classes.endIcon,
          )
        }
        size="22"
        onClick={() => (url ? window.open(url, '_blank') : null)}
      />
    );
  };

  return (
    <div className={clsx(classes.root, classes[type])}>
      {startIcon && icon(type)}
      {
        subtitle
          ? (
            <div className={classes.textContainer}>
              <b>{title}</b>
              {subtitle}
            </div>
          )
          : title
      }
      {endIcon && icon}
    </div>
  );
};

export default Alert;

Alert.defaultProps = {
  startIcon: false,
  endIcon: false,
  url: null,
  subtitle: null,
};

Alert.propTypes = {
  type: PropTypes.oneOf(['warning']).isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  startIcon: PropTypes.bool,
  endIcon: PropTypes.bool,
  url: PropTypes.string,
};
