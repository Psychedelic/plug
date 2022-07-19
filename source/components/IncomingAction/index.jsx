import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import useStyles from './styles';

const IncomingAction = ({ image, url, action }) => {
  const classes = useStyles();

  return (
    <div className={classes.infoContainer}>
      <img src={image} className={classes.image} />
      <Typography variant="h2" className={classes.title}>{url}</Typography>
      <Typography variant="subtitle1">{action}</Typography>
    </div>
  );
};

export default IncomingAction;

IncomingAction.propTypes = {
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};
