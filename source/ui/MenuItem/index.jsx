import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import MuiMenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import { TokenIcon } from '@components';
import useStyles from './styles';

const MenuItem = ({
  name,
  image,
  onClick,
  size,
  border,
  disabled,
  alignLeft,
  icon,
  selected,
  endIcon,
  endText,
  symbol,
}) => {
  const classes = useStyles();

  return (
    <MuiMenuItem
      key={name}
      onClick={onClick}
      disabled={disabled}
      className={clsx(size !== 'small' ? classes.big : classes.small, border && classes.border)}
      classes={{
        root: selected ? classes.selected : null,
      }}
    >
      {
        icon
      }
      {
        !icon
        && (
          <ListItemIcon className={classes.icon}>
            <TokenIcon
              image={image}
              symbol={symbol}
              className={clsx(size === 'large' ? classes.bigImage : classes.smallImage, alignLeft && classes.alignLeft)}
              tokenClassName={classes.token}
            />
          </ListItemIcon>
        )
      }
      <Typography variant={size === 'small' ? 'h6' : 'h5'} className={classes.text}>{name}</Typography>
      {
        (endIcon && selected)
        && (
          <div className={classes.comingSoon}>
            {endIcon}
          </div>
        )
      }
      {
        endText
        && (
        <div className={classes.comingSoon}>
          <Typography variant="subtitle2">{endText}</Typography>
        </div>
        )
      }

    </MuiMenuItem>
  );
};

export default MenuItem;

MenuItem.defaultProps = {
  border: false,
  size: 'medium',
  disabled: false,
  alignLeft: false,
  icon: null,
  endIcon: null,
  selected: false,
  endText: null,
  symbol: ''
};

MenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  border: PropTypes.bool,
  disabled: PropTypes.bool,
  alignLeft: PropTypes.bool,
  icon: PropTypes.node,
  endIcon: PropTypes.node,
  selected: PropTypes.bool,
  endText: PropTypes.string,
  symbol: PropTypes.string,
};
