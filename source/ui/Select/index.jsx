import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import ChevronDown from '@assets/icons/chevron-down.svg';
import InputBase from '../InputBase';
import useStyles from './styles';

const Select = ({
  image, name, shadow, onClick, text,
}) => {
  const classes = useStyles();
  return (
    <InputBase>
      <div className={classes.root} onClick={onClick}>
        <img alt={name} src={image} className={clsx(classes.icon, shadow && classes.iconShadow)} />
        <Typography variant="h4">{name}</Typography>
        {
          text
            ? <Typography variant="subtitle2" className={classes.alignRight}>{text}</Typography>
            : <img src={ChevronDown} className={classes.alignRight} />
        }
      </div>
    </InputBase>
  );
};

export default Select;

Select.defaultProps = {
  shadow: false,
  text: null,
  onClick: null,
};

Select.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  shadow: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.string,
};
