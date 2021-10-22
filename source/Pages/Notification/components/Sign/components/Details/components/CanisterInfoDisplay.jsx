import React from 'react';
import PropTypes from 'prop-types';
import extension from 'extensionizer';
import { useTranslation } from 'react-i18next';

import SIZES from '../../../constants';
import { formatMethodName } from '../utils';
import DisplayBox from './DisplayBox';

const CanisterInfoDisplay = ({ request, shouldWarn, toggleModal }) => {
  const { t } = useTranslation();
  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: shouldWarn ? SIZES.canisterInfoWarning : SIZES.canisterInfoHeight,
    },
  );

  const title = shouldWarn ? t('sign.warning.unknownArguments') : formatMethodName(request?.methodName);
  const subtitle = shouldWarn ? request?.methodName : request?.canisterId;
  return (
    <DisplayBox
      shouldWarn={shouldWarn}
      title={title}
      subtitle={subtitle}
      img={request?.canisterIcon}
      toggleModal={toggleModal}
    />
    // <CanisterInfoContainer className={classes.canisterInfoContainer}>
    //   <CanisterInfoItem
    //     key={canisterInfo?.id}
    //     canister={canisterInfo}
    //     defaultBoxClassName={classes.emptyBox}
    //   />
    // </CanisterInfoContainer>
  );
};

CanisterInfoDisplay.propTypes = {
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
  toggleModal: PropTypes.func.isRequired,
  shouldWarn: PropTypes.bool.isRequired,
};

export default CanisterInfoDisplay;
