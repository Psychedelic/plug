import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import moment from 'moment';

import useStyles from './styles';

const PlugItem = ({
  name, icon, status, date,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <>
      <img className={classes.image} src={icon} />
      <div className={classes.leftContainer}>
        <Typography variant="h5" className={classes.pluggedTitle}>
          {
            status === CONNECTION_STATUS.accepted
              ? `${t('activity.title.pluggedInto')} ${name}`
              : `${t('activity.title.unpluggedFrom')} ${name}`
          }
        </Typography>
        <Typography variant="subtitle2">
          {moment(Date.parse(date)).format('MMM Do')}
        </Typography>
      </div>
    </>
  );
};

PlugItem.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default PlugItem;
