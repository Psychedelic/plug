import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import randomColor from 'random-color';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  genericToken: {
    width: '41px',
    height: '41px',
    textAlign: 'center',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
  },
  small: {
    height: 29,
    width: 29,
    marginRight: theme.spacing(1),
    borderRadius: 26,
    boxShadow:
      '0px 0px 0px rgba(6, 44, 82, 0.1), 0px 1px 3px rgba(64, 66, 69, 0.12), 0px 2px 16px rgba(33, 43, 54, 0.08)',
  },
}));

function TokenIcon({
  image, symbol, className, color, small, ...props
}) {
  const classes = useStyles();
  const backgroundColor = `rgb(${color.values.rgb.join(',')})`;
  return image ? (
    <img src={image} className={className} {...props} />
  ) : (
    <div
      className={clsx(classes.genericToken, className)}
      style={{ backgroundColor }}
    >
      <span>{symbol}</span>
    </div>
  );
}

TokenIcon.propTypes = {
  symbol: PropTypes.string.isRequired,
  image: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.shape({
    values: PropTypes.shape({
      rgb: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  small: PropTypes.bool,
};

TokenIcon.defaultProps = {
  image: null,
  className: '',
  color: randomColor({ luminosity: 'light' }),
  small: false,
};

export default TokenIcon;
