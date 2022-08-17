import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const ListItem = ({ number, text }) => {
  const classes = useStyles();

  return (
    <div>
      <span className={classes.number}>{number}</span>
      <span className={classes.text}>{text}</span>
    </div>
  );
};

export default ListItem;

ListItem.propTypes = {
  number: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};
