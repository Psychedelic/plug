import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import extension from 'extensionizer';
import { useTranslation } from 'react-i18next';

import { formatAssetBySymbol } from '@shared/constants/currencies';
import { useICPPrice } from '@redux/icp';

import { getDabTokens } from '@shared/services/DAB';
import DisplayBox from './DisplayBox';

import SIZES from '../../../constants';
import { formatMethodName, getAssetAmount, getAssetData } from '../utils';

const AssetDisplay = ({
  request, shouldWarn, toggleModal, resize,
}) => {
  const { t } = useTranslation();
  const [asset, setAsset] = useState(null);
  const icpPrice = useICPPrice(true);

  if (resize) {
    extension.windows.update(
      extension.windows.WINDOW_ID_CURRENT,
      {
        height: shouldWarn ? SIZES.detailsWarningHeight : SIZES.assetsHeight,
      },
    );
  }

  const formatRequest = async () => {
    const tokenData = await getDabTokens();
    let assetData = tokenData.find(
      (token) => token?.principal_id?.toString() === request?.canisterId,
    );
    if (!assetData) {
      assetData = getAssetData(request?.canisterId);
    }
    const amount = getAssetAmount(request, assetData?.standard);
    const formattedAsset = {
      ...assetData,
      ...formatAssetBySymbol(amount, assetData?.symbol, icpPrice),
    };
    formattedAsset.amount = formattedAsset.amount === 'Error' || Number.isNaN(formattedAsset.amount) ? null : formattedAsset.amount;
    return formattedAsset;
  };

  useEffect(() => {
    formatRequest().then((formattedAsset) => setAsset(formattedAsset));
  }, [request, icpPrice]);

  const title = shouldWarn ? t('sign.warning.unknownAmount') : formatMethodName(request?.methodName);
  const subtitle = `${asset?.amount ?? '???'} ${asset?.symbol ?? ''} ${asset?.amount !== null && asset?.value ? `(~$${asset?.value?.toFixed?.(2)})` : ''}`;

  return (
    asset && (
      <DisplayBox
        shouldWarn={shouldWarn}
        title={title}
        subtitle={subtitle}
        img={asset?.image || asset?.logo}
        toggleModal={toggleModal}
      />
    )
  );
};

AssetDisplay.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  shouldWarn: PropTypes.bool.isRequired,
  resize: PropTypes.bool.isRequired,
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
