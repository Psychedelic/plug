import React from 'react';
import PropTypes from 'prop-types';
import extension from 'extensionizer';
import { makeStyles } from '@material-ui/core';

import { CanisterInfoContainer, CanisterInfoItem } from '@ui';
import SIZES from '../../../constants';

const useStyles = makeStyles({
  canisterInfoContainer: {
    marginBottom: 0,
  },
  emptyBox: {
    justifyContent: 'space-around',
  },
});

const CanisterInfoDisplay = ({ request, shouldWarn }) => {
  const classes = useStyles();
  const canisterInfo = {
    id: request?.canisterId,
    name: request?.canisterName,
    icon: request?.canisterIcon,
    iconAlt: request?.canisterDescription,
  };
  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: shouldWarn ? SIZES.canisterInfoWarning : SIZES.canisterInfoHeight,
    },
  );
  return (
    <CanisterInfoContainer className={classes.canisterInfoContainer}>
      <CanisterInfoItem
        key={canisterInfo?.id}
        canister={canisterInfo}
        defaultBoxClassName={classes.emptyBox}
      />
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
  shouldWarn: PropTypes.bool.isRequired,
};

export default CanisterInfoDisplay;
