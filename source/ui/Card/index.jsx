import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Card = ({ children, className }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${className}`}>
      {children}
    </div>
  );
};

export default Card;

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.defaultProps = {
  className: '',
};
