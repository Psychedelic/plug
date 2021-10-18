import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import YellowInfo from '@assets/icons/yellow-info.svg';
import useStyles from '../styles';

const DisplayBox = ({
  toggleModal, request, shouldWarn, title, subtitle,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  // const [amount, setAmount] = useState('');
  // const [value, setValue] = useState('');
  // const [assetImg, setAssetImg] = useState(request.canisterIcon);
  // useEffect(() => {
  //   const methodAmount = findAmountInArguments(request);
  //   if (methodAmount) {
  //     setAmount(methodAmount);
  //   }
  //   setAssetImg(request?.canisterIcon);

  //   // Handle for NFTS
  //   if (request?.category === 'nft' && request?.canisterName) {
  //     setAmount(request?.canisterName);

  //     setValue(`#${request?.decodedArguments?.id}`);
  //   }

  //   if (methodAmount) {
  //     // TODO: get price of asset (ICP & XTC) and multiply
  //     setValue('$420.420');
  //   }

  //   if (img.length) {
  //     setAssetImg(img);
  //   }
  // }, [img, request]);

  return (
    <div className={classes.assetContainer}>
      <div className={classes.assetText}>
        { !shouldWarn ? (
          <h2 className={classes.amountTitle}>
            {title}
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
          <span>{subtitle || '???'}&nbsp;</span>
        </p>
      </div>
      <img src={request.canisterIcon} className={classes.assetImg} alt="asset img" />
    </div>
  );
};

DisplayBox.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  shouldWarn: PropTypes.bool.isRequired,
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

export default DisplayBox;
