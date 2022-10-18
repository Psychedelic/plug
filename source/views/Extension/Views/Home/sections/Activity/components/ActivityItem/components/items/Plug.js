import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { CONNECTION_STATUS } from '@shared/constants/connectionStatus';
import { makeStyles } from '@material-ui/core/styles';
import SHADOW_1 from '@shared/styles/shadows';

import ActivityItemDisplay from '../ActivityItemDisplay';

const useStyles = makeStyles(() => ({
  image: {
    height: 41,
    width: 41,
    boxShadow: SHADOW_1,
    borderRadius: 10,
  },
  pluggedTitle: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: 331,
  },
}));

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
