import React from 'react';
import MuiMenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ChevronRight from '@assets/icons/chevron-right.svg';
import useStyles from './styles';

const MenuItemDetailed = ({
  name, description, image, onClick, ...other
}) => {
  const classes = useStyles();

  return (
    <MuiMenuItem
      key={name}
      onClick={onClick}
      className={classes.root}
      {...other}
    >

      <img src={image} className={classes.icon} />

      <div className={classes.textContainer}>
        <Typography variant="h5" className={classes.bold}>{name}</Typography>
        <Typography variant="subtitle1">{description}</Typography>
      </div>

      <img src={ChevronRight} className={classes.chevron} />

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
