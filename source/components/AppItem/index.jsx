import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import DeleteImg from '@assets/icons/delete.svg';
import { useTranslation } from 'react-i18next';
import ListIcon from '@material-ui/icons/List';
import clsx from 'clsx';
import GenericIcon from '../GenericIcon';
import useStyles from './styles';

const AppItem = ({
  name, icon, onDelete, onDetail,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [hover, setHover] = useState(false);

  return (
    <div
      className={classes.root}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <GenericIcon image={icon} style={{ borderRadius: 10 }} />
      <Typography variant="h5" className={classes.title}>{name}</Typography>
      <IconButton className={clsx(classes.icon, classes.firstIcon, hover && classes.visible)} size="medium" onClick={onDetail}>
        <ListIcon />
      </IconButton>
      <IconButton size="medium" onClick={onDelete} className={clsx(classes.icon, hover && classes.visible)}>
        <img src={DeleteImg} alt={t('common.delete')} />
      </IconButton>
    </div>
  );
};

export default AppItem;

AppItem.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
};
