import React from 'react';
import PropTypes from 'prop-types';
import { CanisterInfoContainer, CanisterInfoItem } from '@ui';

const CanisterInfoDisplay = ({ request }) => {
  const canisterInfo = {
    id: request?.canisterId,
    name: request?.canisterName,
    icon: request?.canisterIcon,
    iconAlt: request?.canisterDescription,
  };
  return (
    <CanisterInfoContainer>
      <CanisterInfoItem key={canisterInfo?.id} canister={canisterInfo} />
    </CanisterInfoContainer>
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
};

export default CanisterInfoDisplay;
