import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getCanisterMetadata } from '@psychedelic/dab-js';

import DisplayBox from './DisplayBox';

const getNFTIndex = (request, canisterMetadata) => {
  const { standard } = canisterMetadata;
  const indexInArgs = {
    EXT: (args) => args?.[0]?.token,
    ICPunks: (args) => args?.[1],
    DepartureLabs: (args) => args?.[1],
  }[standard];
  return indexInArgs(request?.decodedArguments);
};

const NFTDisplay = ({ request, shouldWarn, toggleModal }) => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getCanisterMetadata().then((response) => {
      setLoading(false);
      if (request?.decodedArguments) {
        setTitle(getNFTIndex(request, response));
      }
    });
  }, [request]);
  return (
    <DisplayBox
      loading={loading}
      shouldWarn={shouldWarn}
      title={title || 'Unknown ID'}
      subtitle={request?.canisterName || 'Unknown Collection'}
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
};

export default NFTDisplay;
