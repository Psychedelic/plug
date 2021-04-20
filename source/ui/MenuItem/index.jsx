import React from 'react';
import MuiMenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import useStyles from './styles';

const MenuItem = ({
  name, image, onClick, isBig,
}) => {
  const classes = useStyles();
  return (
    <MuiMenuItem
      key={name}
      onClick={onClick}
      className={isBig && classes.big}
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
  isBig: false,
};

MenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isBig: PropTypes.bool,
};
