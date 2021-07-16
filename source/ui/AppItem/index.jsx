import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import useStyles from './styles';
import GenericIcon from '../GenericIcon';

const AppItem = ({
  name, deleteIcon, icon, action, onClick,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GenericIcon image={icon} />
      <Typography variant="h5" className={classes.title}>{name}</Typography>
      <IconButton className={classes.icon} size="medium" onClick={onClick}>
        <img src={deleteIcon} alt={action} />
      </IconButton>
    </div>
  );
};

export default AppItem;

AppItem.propTypes = {
  name: PropTypes.string.isRequired,
  deleteIcon: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
