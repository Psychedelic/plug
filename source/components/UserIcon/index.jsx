import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import useStyles from './styles';

const UserIcon = ({ big, icon }) => {
  const { emoji } = useSelector((state) => state.wallet);

  const classes = useStyles();

  const [displayIcon, setDisplayIcon] = useState('👽');

  useEffect(() => {
    if (icon) {
      setDisplayIcon(icon);
    } else if (emoji) {
      setDisplayIcon(emoji);
    }
  }, [icon, emoji]);

  return (
    <div className={clsx(classes.fancyCircle, big ? classes.big : classes.small)}>
      <span>
        {displayIcon}
      </span>
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
