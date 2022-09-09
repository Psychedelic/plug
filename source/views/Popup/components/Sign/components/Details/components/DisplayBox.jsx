import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import YellowInfo from '@assets/icons/yellow-info.svg';
import useStyles from '../styles';

const DisplayBox = ({
  toggleModal, request, shouldWarn, title, subtitle, img,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.assetContainer}>
      <div className={classes.assetText}>
        <h2 className={`${classes.amountTitle} ${shouldWarn ? classes.yellowTitle : ''}`}>
          {title || t('sign.warning.unknownArguments')}
          {shouldWarn && (
            <img
              src={YellowInfo}
              className={classes.yellowInfoIcon}
              onClick={toggleModal}
              alt="more-info"
            />
          )}
        </h2>
        <p className={classes.amountDescription}>
          <span>{subtitle || '???'}&nbsp;</span>
        </p>
      </div>
      {
        React.isValidElement(img)
          ? img
          : <img src={img || request?.canisterIcon} className={classes.assetImg} alt="asset" />
      }
    </div>
  );
};

DisplayBox.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  shouldWarn: PropTypes.bool.isRequired,
  img: PropTypes.string || PropTypes.node,
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
