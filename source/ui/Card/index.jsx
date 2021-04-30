import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Card = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {children}
    </div>
  );
};

export default Card;

Card.propTypes = {
  children: PropTypes.node.isRequired,
};
