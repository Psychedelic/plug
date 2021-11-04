import React from 'react';
import ReceiveImg from '@assets/icons/receive-activity.svg';
import SendImg from '@assets/icons/send-activity.svg';
import BurnImg from '@assets/icons/burn-activity.svg';
import MintImg from '@assets/icons/mint-activity.svg';
import PropTypes from 'prop-types';
import useStyles from './styles';

const TYPE_IMAGES = {
  RECEIVE: ReceiveImg,
  SEND: SendImg,
  BURN: BurnImg,
  MINT: MintImg,
  TRANSFER: SendImg,
};

const GenericIcon = ({ image, type }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {
        Object.keys(TYPE_IMAGES).includes(type?.toUpperCase())
        && <img className={classes.activity} src={TYPE_IMAGES[type.toUpperCase()]} />
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
  type: PropTypes.string,
};
