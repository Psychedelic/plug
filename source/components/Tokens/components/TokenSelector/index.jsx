import React from 'react';
import coins from '@assets/icons/coins.svg';
import imageIcon from '@assets/icons/imageIcon.svg';
import useStyles from './styles';

// eslint-disable-next-line react/prop-types
const TokenSelector = ({ onClose }) => {
  const classes = useStyles();
  return (
    <>
      <div>
        <div
          onClick={() => navigator.navigate('add-token')}
          className={classes.addTokenButton}
          data-testid="add-custom-token-button"
        >
          <img
            src={coins}
            alt="reload"
          />  Add Token
        </div>
        <div
          onClick={() => navigator.navigate('add-nft')}
          className={classes.addNftButton}
          data-testid="add-custom-token-button"
        >
          <img
            src={imageIcon}
            alt="reload"
          />
          Add NFT
        </div>
      </div>
      <div className={classes.background} onClick={onClose} />
    </>
  );
};

export default TokenSelector;
