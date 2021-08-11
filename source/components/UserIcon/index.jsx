import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import WhitePencil from '@assets/icons/white-pencil.svg';
import useStyles from './styles';

const UserIcon = ({
  big, icon, edit, ...other
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
      className={
        clsx(
          classes.fancyCircle,
          big ? classes.big : classes.small,
        )
}
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
  big: false,
  icon: null,
  edit: false,
};

UserIcon.propTypes = {
  big: PropTypes.bool,
  icon: PropTypes.string,
  edit: PropTypes.bool,
};
