import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { Button } from '@components';
import useStyles from './styles';

const ActionCard = ({
  icon, title, subtitle, button, onClick, buttonProps,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img src={icon} className={classes.image} />
      <Typography variant="h3">{title}</Typography>
      <Typography variant="h5">{subtitle}</Typography>
      <Button variant="rainbow" value={button} onClick={onClick} style={{ marginTop: 12 }} {...buttonProps} />
    </div>
  );
};

export default ActionCard;

ActionCard.defaultProps = {
  buttonProps: {},
};

ActionCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  buttonProps: PropTypes.objectOf(PropTypes.string),
};
