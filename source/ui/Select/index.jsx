import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import ChevronDown from '@assets/icons/chevron-down.svg';
import InputBase from '../InputBase';
import useStyles from './styles';

const Select = ({
  image, name, shadow, onClick, text, icon,
}) => {
  const classes = useStyles();
  return (
    <InputBase>
      <div className={classes.root} onClick={onClick}>
        {
          icon
        }
        {
          image
          && (
          <img
            alt={name}
            src={image}
            className={clsx(classes.icon, shadow && classes.iconShadow)}
          />
          )
        }
        <div className={classes.textContainer}>
          <Typography variant="h4">{name}</Typography>
          {
            text
            && <Typography variant="subtitle2" style={{ marginTop: 4 }}>{text}</Typography>
          }
        </div>

        <img src={ChevronDown} className={classes.alignRight} />
      </div>
    </InputBase>
  );
};

export default Select;

Select.defaultProps = {
  shadow: false,
  text: null,
  onClick: null,
  icon: null,
};

Select.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  shadow: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.node,
};
