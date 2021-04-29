import React from 'react';
import MuiMenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ChevronDown from '@assets/icons/chevron-down.svg';
import useStyles from './styles';

const MenuItemDetailed = ({
  name, description, image, onClick,
}) => {
  const classes = useStyles();

  return (
    <MuiMenuItem
      key={name}
      onClick={onClick}
      className={classes.root}
    >

      <img src={image} className={classes.icon} />

      <div className={classes.textContainer}>
        <Typography variant="h5" className={classes.bold}>{name}</Typography>
        <Typography variant="subtitle1">{description}</Typography>
      </div>

      <img src={ChevronDown} className={classes.chevron} />

    </MuiMenuItem>
  );
};

export default MenuItemDetailed;

MenuItemDetailed.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
