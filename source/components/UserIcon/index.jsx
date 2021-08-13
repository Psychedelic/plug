import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import useStyles from './styles';

const UserIcon = ({ size, icon, ...other }) => {
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
    <div
      className={
        clsx(classes.fancyCircle,
          // eslint-disable-next-line no-nested-ternary
          size === 'big'
            ? classes.big
            : size === 'small'
              ? classes.small
              : classes.medium)
      }
      {...other}
    >
      <span>
        {displayIcon}
      </span>
    </div>
  );
};

export default UserIcon;

UserIcon.defaultProps = {
  size: 'medium',
  icon: null,
};

UserIcon.propTypes = {
  size: PropTypes.string,
  icon: PropTypes.string,
};
