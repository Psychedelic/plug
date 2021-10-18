import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { formatAssetBySymbol, TOKENS } from '@shared/constants/currencies';
import { useICPPrice } from '@redux/icp';

import DisplayBox from './DisplayBox';

// eslint-disable-next-line max-len
const getAssetData = (canisterId) => Object.values(TOKENS).find((token) => token.canisterId === canisterId);

const getAssetAmount = (request) => {
  const { methodName } = request || {};
  const amountInArgs = {
    transfer: (args) => args?.[0]?.amount,
    transferErc20: (args) => args?.[1],
    send_dfx: (args) => args?.[0]?.amount,
  }[methodName];
  return amountInArgs(request?.decodedArguments);
};

const AssetDisplay = ({ request, shouldWarn, toggleModal }) => {
  const [asset, setAsset] = useState(null);
  const icpPrice = useICPPrice(true);
  useEffect(() => {
    const amount = getAssetAmount(request);
    const assetData = getAssetData(request?.canisterId);
    const formattedAsset = formatAssetBySymbol(amount, assetData.symbol, icpPrice);
    setAsset(formattedAsset);
  }, [request]);
  return (
    <DisplayBox
      shouldWarn={shouldWarn}
      title={asset?.value || 'Unknown Amount'}
      subtitle={`${asset?.amount || '???'} ${asset?.symbol || ''}`}
      img={asset?.image}
      toggleModal={toggleModal}
    />
  );
};

AssetDisplay.propTypes = {
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

export default AssetDisplay;
