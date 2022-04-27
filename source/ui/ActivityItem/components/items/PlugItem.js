import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import moment from 'moment';

import useStyles from './styles';
import ActivityItemDisplay from '../ActivityItemDisplay';

const PlugItem = ({
  name, icon, status, date,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  // So it doesn't display refused connections
  if (status === CONNECTION_STATUS.refused) {
    return null;
  }

  return (
    <ActivityItemDisplay
      image={<img className={classes.image} src={icon} />}
      title={status === CONNECTION_STATUS.accepted
        ? `${t('activity.title.pluggedInto')} ${name}`
        : `${t('activity.title.unpluggedFrom')} ${name}`}
      subtitle={moment(Date.parse(date)).format('MMM Do')}
      titleClassName={classes.pluggedTitle}
    />
  );
};

PlugItem.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default PlugItem;
