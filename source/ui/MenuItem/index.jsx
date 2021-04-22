import React from 'react';
import MuiMenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useStyles from './styles';

const MenuItem = ({
  name, image, onClick, big, border,
}) => {
  const classes = useStyles();
  return (
    <MuiMenuItem
      key={name}
      onClick={onClick}
      className={clsx(big && classes.big, border && classes.border)}
    >
      <ListItemIcon className={classes.icon}>
        <img src={image} alt={name} />
      </ListItemIcon>
      <Typography variant="h5" className={classes.text}>{name}</Typography>
    </MuiMenuItem>
  );
};

export default MenuItem;

MenuItem.defaultProps = {
  border: false,
  big: false,
};

MenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  big: PropTypes.bool,
  border: PropTypes.bool,
};
