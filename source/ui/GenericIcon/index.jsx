import React from 'react';
import ReceiveImg from '@assets/icons/receive-activity.svg';
import SendImg from '@assets/icons/send-activity.svg';
import BurnImg from '@assets/icons/burn-activity.svg';
import { ACTIVITY_TYPES } from '@shared/constants/activity';
import PropTypes from 'prop-types';
import useStyles from './styles';

const TYPE_IMAGES = {
  [ACTIVITY_TYPES.RECEIVE]: ReceiveImg,
  [ACTIVITY_TYPES.SEND]: SendImg,
  [ACTIVITY_TYPES.BURN]: BurnImg,
};

const GenericIcon = ({ image, type }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {
        [ACTIVITY_TYPES.RECEIVE, ACTIVITY_TYPES.SEND, ACTIVITY_TYPES.BURN].includes(type)
        && <img className={classes.activity} src={TYPE_IMAGES[type]} />
      }
      <img className={classes.root} src={image} />
    </div>
  );
};

export default GenericIcon;

GenericIcon.defaultProps = {
  type: null,
};

GenericIcon.propTypes = {
  image: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(ACTIVITY_TYPES)),
};
