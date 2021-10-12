import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import extension from 'extensionizer';
import DisplayBox from './components/DisplayBox';
import WarningBox from './components/WarningBox';
import SIZES from '../../constants';
import useStyles from './styles';

const Details = ({ shouldWarn, toggleModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const height = shouldWarn ? SIZES.detailsWarningHeight : SIZES.detailsNormalHeight;

  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height,
    },
  );

  return (
    <div className={classes.detailsWrapper}>
      <div className={classes.detailsImage} />
      <h1 className={classes.canisterId}>
        2ji5m-raaaa-aaaah-aanoa-cai
      </h1>
      <p className={classes.description}>
        {t('sign.warning.action')}
      </p>
      <DisplayBox
        toggleModal={toggleModal}
        assetType="XTC"
      />
      { shouldWarn && (<WarningBox />)}
    </div>
  );
};

Details.propTypes = {
  shouldWarn: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
};

Details.defaultProps = {
  shouldWarn: false,
};

export default Details;
