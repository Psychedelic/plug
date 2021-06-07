import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const LinkButton = ({
  value, onClick, startIcon, ...other
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root} onClick={onClick} {...other}>
      {
        startIcon
        && <img className={classes.image} src={startIcon} alt={value} />
      }
      <span className={classes.text}>{value}</span>
    </div>
  );
};

export default LinkButton;

LinkButton.defaultProps = {
  startIcon: null,
};

LinkButton.propTypes = {
  value: PropTypes.string.isRequired,
  startIcon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
