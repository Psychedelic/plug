import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import extension from 'extensionizer';
import { IncomingAction } from '@ui';

import DisplayBox from './components/DisplayBox';
import WarningBox from './components/WarningBox';
import SIZES from '../../constants';
import useStyles from './styles';

const Details = ({
  shouldWarn, toggleModal, url, icon,
}) => {
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
      <IncomingAction url={url} image={icon} action={t('sign.warning.action')} />
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
  url: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

Details.defaultProps = {
  shouldWarn: false,
  icon: '',
};

export default Details;
