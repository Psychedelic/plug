import React from 'react';
import MuiMenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';

const MenuItem = ({
  name, image, onClick, size, border, disabled, alignLeft,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <MuiMenuItem
      key={name}
      onClick={onClick}
      disabled={disabled}
      className={clsx(size !== 'small' ? classes.big : classes.small, border && classes.border)}
    >
      <ListItemIcon className={classes.icon}>
        <img src={image} className={clsx(size === 'large' ? classes.bigImage : classes.smallImage, alignLeft && classes.alignLeft)} />
      </ListItemIcon>
      <Typography variant="h5" className={classes.text}>{name}</Typography>

      {
        disabled
        && (
        <div className={classes.comingSoon}>
          <Typography variant="h5" className={classes.comingSoon}>{t('common.comingSoon')}</Typography>
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
};

MenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  border: PropTypes.bool,
  disabled: PropTypes.bool,
  alignLeft: PropTypes.bool,
};
