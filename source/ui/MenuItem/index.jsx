import React from 'react';
import MuiMenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PropTypes from 'prop-types';
import useStyles from './styles';

const MenuItem = ({ name, image, onClick }) => {
  const classes = useStyles();
  return (
    <MuiMenuItem
      key={name}
      onClick={onClick}
    >
      <ListItemIcon className={classes.icon}>
        <img src={image} alt={name} />
      </ListItemIcon>
      <span className={classes.text}>{name}</span>
    </MuiMenuItem>
  );
};

export default MenuItem;

MenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
