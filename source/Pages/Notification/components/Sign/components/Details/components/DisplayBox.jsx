import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { CURRENCIES } from '@shared/constants/currencies';
import YellowInfo from '@assets/icons/yellow-info.svg';
import useStyles from '../styles';

const DisplayBox = ({
  toggleModal, amount: propAmount, assetType, img,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [value, setValue] = useState('');
  const [assetSymbol, setAssetSymbol] = useState('???');
  const [assetImg, setAssetImg] = useState(false);

  useEffect(() => {
    const currency = CURRENCIES.get(assetType);

    setAmount(propAmount);

    // Handle for NFTS
    if (assetType === 'NFT' && propAmount) {
      setAssetSymbol('');
      setAmount(propAmount.collection);
      setValue(`#${propAmount.id}`);
    }

    if (currency) {
      setAssetImg(currency.image);
      setAssetSymbol(currency.symbol);

      if (propAmount) {
        // get value of asset (ICP & WTC)
        setValue('$420.420');
      }
    }

    if (img.length) {
      setAssetImg(img);
    }
  }, [img, assetType, propAmount]);

  return (
    <div className={classes.assetContainer}>
      <div className={classes.assetText}>
        { value ? (
          <h2 className={classes.amountTitle}>
            {value}
          </h2>
        ) : (
          <h2 className={`${classes.amountTitle} ${classes.yellowTitle}`}>
            {t('sign.warning.unknownAmount')}
            <img
              src={YellowInfo}
              className={classes.yellowInfoIcon}
              onClick={toggleModal}
              alt="more-info"
            />
          </h2>
        )}
        <p className={classes.amountDescription}>
          <span>{amount || '?.??'}&nbsp;</span>
          <span>{assetSymbol}</span>
        </p>
      </div>
      { assetImg
        ? (<img src={assetImg} className={classes.assetImg} alt="asset img" />)
        : (<div className={classes.emptyImg} alt="empty img" />)}
    </div>
  );
};

DisplayBox.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  amount: PropTypes.oneOf([
    PropTypes.obj,
    PropTypes.string,
  ]).isRequired,
  assetType: PropTypes.string.isRequired,
  img: PropTypes.string,
};

DisplayBox.defaultProps = {
  img: '',
};

export default DisplayBox;
