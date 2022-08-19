import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import MuiMenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import TokenIcon from '../TokenIcon';
import useStyles from './styles';

const MenuItem = ({
  name,
  logo,
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
  className,
  accountNameTestId,
  itemNameTestId,
  ...other
}) => {
  const classes = useStyles();
  return (
    <MuiMenuItem
      key={name}
      onClick={onClick}
      disabled={disabled}
      data-testid={`${itemNameTestId}-${name}`}
      className={clsx(size !== 'small' ? classes.big : classes.small, border && classes.border, className)}
      classes={{
        root: selected ? classes.selected : null,
      }}
      {...other}
    >
      {
        icon
      }
      {
        !icon && logo && (
          <ListItemIcon className={classes.icon}>
            <TokenIcon
              logo={logo || image}
              symbol={symbol}
              className={clsx(size === 'large' ? classes.bigImage : classes.smallImage, alignLeft && classes.alignLeft)}
            />
          </ListItemIcon>
        )
      }
      <Typography variant={size === 'small' ? 'h6' : 'h5'} className={classes.text} data-testid={`${accountNameTestId}-${name}`}>{name}</Typography>
      {
        endIcon
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
  symbol: '',
  className: '',
  logo: null,
  accountNameTestId: '',
  itemNameTestId: '',
};

MenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  border: PropTypes.bool,
  disabled: PropTypes.bool,
  alignLeft: PropTypes.bool,
  icon: PropTypes.node,
  endIcon: PropTypes.node,
  selected: PropTypes.bool,
  endText: PropTypes.string,
  symbol: PropTypes.string,
  accountNameTestId: PropTypes.string,
  itemNameTestId: PropTypes.string,
  image: PropTypes.string.isRequired,
};
