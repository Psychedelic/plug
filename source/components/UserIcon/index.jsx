import React from 'react';
import DefaultIcon from '@assets/icons/account-circle.png';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useStorage from '../Storage/hooks/useStorage';
import useStyles from './styles';

const UserIcon = ({ big, icon }) => {
  const { storage: storedIcon } = useStorage();
  const classes = useStyles();

  let displayIcon = null;

  if (icon) {
    displayIcon = <span>{icon}</span>;
  } else if (storedIcon) {
    displayIcon = <span>{storedIcon}</span>;
  } else {
    displayIcon = <img src={DefaultIcon} alt="Icon" />;
  }

  return (
    <div className={clsx(classes.fancyCircle, big ? classes.big : classes.small)}>
      {displayIcon}
    </div>
  );
};

export default UserIcon;

UserIcon.defaultProps = {
  big: false,
  icon: null,
};

UserIcon.propTypes = {
  big: PropTypes.bool,
  icon: PropTypes.string,
};
