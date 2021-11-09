import React from 'react';
import ReceiveImg from '@assets/icons/receive-activity.svg';
import SendImg from '@assets/icons/send-activity.svg';
import BurnImg from '@assets/icons/burn-activity.svg';
import MintImg from '@assets/icons/mint-activity.svg';
import LightningImg from '@assets/icons/lightning-activity.svg';
import PropTypes from 'prop-types';
import useStyles from './styles';

const getActivityIcon = (type) => ({
  RECEIVE: ReceiveImg,
  SEND: SendImg,
  BURN: BurnImg,
  MINT: MintImg,
  TRANSFER: SendImg,
})[type] || LightningImg;

const GenericIcon = ({ image, type }) => {
  const classes = useStyles();
  const activityIcon = type ? getActivityIcon(type) : null;
  return (
    <div className={classes.root}>
      <img
        className={classes.activity}
        src={activityIcon}
      />
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
  type: PropTypes.string,
};
