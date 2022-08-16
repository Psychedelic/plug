import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import useStyles from './styles';

const SelectButton = ({
  value, startImage, endImage, onClick, selected, onEndImageClick,
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, selected && classes.selected)} onClick={onClick}>
      <img src={startImage} className={classes.iconLeft} />
      <Typography variant="h4">{value}</Typography>
      {
        endImage
        && <img src={endImage} className={classes.iconRight} onClick={onEndImageClick} />
      }
    </div>
  );
};

export default SelectButton;

SelectButton.propTypes = {
  value: PropTypes.string.isRequired,
  startImage: PropTypes.string.isRequired,
  endImage: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  onEndImageClick: PropTypes.func.isRequired,
};
