import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useStyles from './styles';

const InfoRow = ({
  name, value, total, border, spaced, image,
}) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.infoRow, border && classes.border, spaced && classes.spaced)}>
      <Typography variant="subtitle1">{name}</Typography>
      <div className={classes.valueContainer}>
        {
          image
          && <img src={image} className={classes.image} />
        }
        <Typography variant="h5" className={total && classes.total}>{value}</Typography>
      </div>
    </div>
  );
};

export default InfoRow;

InfoRow.defaultProps = {
  total: false,
  border: false,
  spaced: false,
  image: null,
};

InfoRow.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  total: PropTypes.bool,
  border: PropTypes.bool,
  spaced: PropTypes.bool,
  image: PropTypes.string,
};
