import React from 'react';
import coins from '@assets/icons/coins.svg';
import imageIcon from '@assets/icons/imageIcon.svg';
import { useRouter } from '@components/Router';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import useStyles from './styles';

// eslint-disable-next-line react/prop-types
const TokenSelector = ({ onClose }) => {
  const classes = useStyles();
  const { navigator } = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <div
        onClick={() => navigator.navigate('add-token')}
        className={classes.addTokenButton}
        data-testid="add-custom-token-button"
      >
        <img
          src={coins}
          alt="reload"
        />  <Typography variant="h5" data-testid="wallet-name">{t('addToken.title')}</Typography>
      </div>
      <div
        onClick={() => navigator.navigate('add-nft')}
        className={classes.addNftButton}
        data-testid="add-custom-nft-button"
      >
        <img
          src={imageIcon}
          alt="reload"
        />
        <Typography variant="h5" data-testid="wallet-name">{t('addNFT.title')}</Typography>
      </div>
      <div className={classes.background} onClick={onClose} />
    </>
  );
};

export default TokenSelector;
