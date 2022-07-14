import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './styles';

const LinkButton = ({
  value, onClick, startIcon, spanTestId, ...other
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root} onClick={onClick} {...other}>
      {
        startIcon
        && <img className={classes.image} src={startIcon} alt={value} />
      }
      <span className={classes.text} data-testid={spanTestId}>{value}</span>
    </div>
  );
};

export default LinkButton;

LinkButton.defaultProps = {
  startIcon: null,
  spanTestId: 'link-button-text',
};

LinkButton.propTypes = {
  value: PropTypes.string.isRequired,
  startIcon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  spanTestId: PropTypes.string,
};
