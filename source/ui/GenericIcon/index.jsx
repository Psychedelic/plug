import React from 'react';
import ReceiveImg from '@assets/icons/receive-activity.svg';
import SendImg from '@assets/icons/send-activity.svg';
import BurnImg from '@assets/icons/burn-activity.svg';
import MintImg from '@assets/icons/mint-activity.svg';
import LightningImg from '@assets/icons/lightning-activity.svg';
import PropTypes from 'prop-types';
import useStyles from './styles';

const TYPE_IMAGES = {
  RECEIVE: ReceiveImg,
  SEND: SendImg,
  BURN: BurnImg,
  MINT: MintImg,
  TRANSFER: SendImg,
};

const GenericIcon = ({ image, type, style }) => {
  const classes = useStyles();
  return (
    <div className={classes.root} style={style}>
      {type && (
        <img
          className={classes.activity}
          src={TYPE_IMAGES[type] || LightningImg}
        />
      )}
      <img className={classes.root} src={image} style={style} />
    </div>
  );
};

export default GenericIcon;

GenericIcon.defaultProps = {
  type: null,
  style: null,
};

GenericIcon.propTypes = {
  image: PropTypes.string.isRequired,
  type: PropTypes.string,
  style: PropTypes.object,
};
