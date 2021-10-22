import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import extension from 'extensionizer';
import { useTranslation } from 'react-i18next';

import { decodeTokenId } from '@shared/utils/ext';

import DisplayBox from './DisplayBox';
import SIZES from '../../../constants';

const getNFTId = (request) => {
  const indexInArgs = {
    transfer: (args) => args?.[0]?.token || args?.[1],
    transfer_to: (args) => args?.[1],
  }[request?.methodName];
  return indexInArgs(request?.decodedArguments);
};

const NFTDisplay = ({ request, shouldWarn, toggleModal }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');

  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: shouldWarn ? SIZES.detailsWarningHeight : SIZES.nftHeight,
    },
  );

  useEffect(() => {
    if (request?.decodedArguments) {
      const nftId = getNFTId(request);
      setTitle(`#${Number.isNaN(Number(nftId)) ? decodeTokenId(nftId) : nftId}`);
    }
  }, [request]);
  return (
    <DisplayBox
      shouldWarn={shouldWarn}
      title={title || t('sign.warning.unknownId')}
      subtitle={request?.name || t('sign.warning.unknownCollection')}
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
    name: PropTypes.string,
    canisterUrl: PropTypes.string,
    methodName: PropTypes.string,
    category: PropTypes.string,
    decodedArguments: PropTypes.any, // eslint-disable-line
  }).isRequired,
};

export default NFTDisplay;
