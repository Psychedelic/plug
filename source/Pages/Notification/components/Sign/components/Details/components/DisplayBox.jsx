import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import YellowInfo from '@assets/icons/yellow-info.svg';
import useStyles from '../styles';

const findAmountInArguments = (request) => (request?.methodName === 'transfer'
  ? request?.decodedArguments?.[0]?.amount
  : request?.decodedArguments?.[1]);

const DisplayBox = ({
  toggleModal, img, request,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [value, setValue] = useState('');
  const [assetImg, setAssetImg] = useState(request.canisterIcon);

  useEffect(() => {
    // Tengo los args?
    //     Si: Es transfer?
    //        Si: Mostramos data especial ---> Ver si category === nft o no
    //        No: Mostramos normalaso los details con los args
    //     No: Mostrar warning modal

    const methodAmount = findAmountInArguments(request);
    if (methodAmount) {
      setAmount(methodAmount);
    }
    setAssetImg(request?.canisterIcon);

    // Handle for NFTS
    if (request?.category === 'nft' && request?.canisterName) {
      setAmount(request?.canisterName);

      setValue(`#${request?.decodedArguments?.id}`);
    }

    if (methodAmount) {
      // TODO: get price of asset (ICP & XTC) and multiply
      setValue('$420.420');
    }

    if (img.length) {
      setAssetImg(img);
    }
  }, [img, request]);

  return (
    <div className={classes.assetContainer}>
      <div className={classes.assetText}>
        { value ? (
          <h2 className={classes.amountTitle}>
            {value}
          </h2>
        ) : (
          <h2 className={`${classes.amountTitle} ${classes.yellowTitle}`}>
            {t('sign.warning.unknownArguments')}
            <img
              src={YellowInfo}
              className={classes.yellowInfoIcon}
              onClick={toggleModal}
              alt="more-info"
            />
          </h2>
        )}
        <p className={classes.amountDescription}>
          <span>{amount || '???'}&nbsp;</span>
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
  img: PropTypes.string,
  request: PropTypes.shape({
    canisterDescription: PropTypes.string,
    canisterIcon: PropTypes.string,
    canisterId: PropTypes.string,
    canisterName: PropTypes.string,
    canisterUrl: PropTypes.string,
    methodName: PropTypes.string,
    category: PropTypes.string,
    decodedArguments: PropTypes.any, // eslint-disable-line
  }).isRequired,
};

DisplayBox.defaultProps = {
  img: '',
};

export default DisplayBox;
