import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import WhitePencil from '@assets/icons/white-pencil.svg';
import useStyles from './styles';

const UserIcon = ({
  size, icon, edit, ...other
}) => {
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
      className={clsx(classes.fancyCircle, classes[size])}
      {...other}
    >
      {
        edit
        && (
          <div className={classes.edit}>
            <img src={WhitePencil} />
          </div>
        )
      }
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
  edit: false,
};

UserIcon.propTypes = {
  size: PropTypes.string,
  icon: PropTypes.string,
  edit: PropTypes.bool,
};
