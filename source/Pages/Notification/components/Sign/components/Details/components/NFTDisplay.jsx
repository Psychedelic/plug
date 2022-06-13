import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import extension from 'extensionizer';
import { useTranslation } from 'react-i18next';

import { decodeTokenId } from '@shared/utils/ext';

import DisplayBox from './DisplayBox';
import SIZES from '../../../constants';
import { formatMethodName } from '../utils';

const getNFTId = (request) => {
  const indexInArgs = {
    transfer: (args) => args?.[0]?.token || args?.[1],
    transfer_to: (args) => args?.[1],
  }[request?.methodName];
  return indexInArgs(request?.decodedArguments);
};

const NFTDisplay = ({
  request, shouldWarn, toggleModal, resize,
}) => {
  const { t } = useTranslation();
  const [subtitle, setSubtitle] = useState('');

  if (resize) {
    extension.windows.update(
      extension.windows.WINDOW_ID_CURRENT,
      {
        height: shouldWarn ? SIZES.detailsWarningHeight : SIZES.nftHeight,
      },
    );
  }

  useEffect(() => {
    if (request?.decodedArguments) {
      const nftId = getNFTId(request);
      const index = (nftId && Number.isNaN(Number(nftId))) ? decodeTokenId(nftId) : nftId;
      const canisterName = request?.canisterName ? request?.canisterName : '';
      setSubtitle((index || index === 0) ? `${canisterName} #${index}` : `Uknown ${canisterName}`);
    } else {
      setSubtitle(request?.methodName ? formatMethodName(request?.methodName) : t('sign.warning.unknownCollection'));
    }
  }, [request]);
  return (
    <DisplayBox
      shouldWarn={shouldWarn}
      title={shouldWarn ? t('sign.warning.unknownArguments') : formatMethodName(request?.methodName)}
      subtitle={subtitle}
      img={request?.canisterIcon}
      toggleModal={toggleModal}
    />
  );
};

NFTDisplay.propTypes = {
  toggleModal: PropTypes.func.isRequired,
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
  resize: PropTypes.bool.isRequired,
};

export default NFTDisplay;
