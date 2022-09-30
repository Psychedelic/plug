import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'react-feather';
import { setAssets, setAssetsLoading } from '@redux/wallet';
import clsx from 'clsx';

import { TOKENS } from '@shared/constants/currencies';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { useICPPrice } from '@redux/icp';
import { setICNSData } from '@redux/icns';
import { useScroll } from '@hooks';
import AssetItem from '../AssetItem';
import useStyles from './styles';
import TokenSelector from './components/TokenSelector';

const Tokens = () => {
  const classes = useStyles();
  const { assets, assetsLoading } = useSelector((state) => state.wallet);
  const { currentNetwork } = useSelector((state) => state.network);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const icpPrice = useICPPrice();
  const { onScroll, fullScroll } = useScroll();
  const [displayCustomToken, setDisplayCustomToken] = useState(false);

  const fetchAssets = (cb = () => {}, refresh) => {
    sendMessage({
      type: HANDLER_TYPES.GET_ASSETS,
      params: { refresh },
    }, (keyringAssets) => {
      cb(keyringAssets);
      dispatch(setAssets({ keyringAssets, icpPrice }));
      dispatch(setAssetsLoading(false));
      setLoading(false);
    });
  };

  const handleFetchAssets = () => {
    dispatch(setAssetsLoading(true));
    setLoading(true);

    return new Promise((resolve) => {
      fetchAssets(resolve);
    });
  };

  const handleRemoveAsset = (canisterId) => {
    sendMessage({
      type: HANDLER_TYPES.REMOVE_CUSTOM_TOKEN,
      params: { canisterId },
    }, (newTokens) => {
      fetchAssets();
    });
  };

  useEffect(() => {
    const id = setInterval(() => {
      !assetsLoading && fetchAssets();
    }, 15000);
    fetchAssets();
    return () => clearInterval(id);
  }, [icpPrice]);

  useEffect(() => {
    setLoading(assetsLoading);
  }, [assetsLoading]);

  useEffect(() => {
    sendMessage({
      type: HANDLER_TYPES.GET_ICNS_DATA,
      params: {},
    }, (icnsData) => {
      dispatch(setICNSData(icnsData));
    });
  }, []);

  return (
    <div className={classes.root}>
      <div
        className={clsx(
          classes.tokenContainer, assets?.length > 4 && !fullScroll && classes.scrollShadow,
        )}
        onScroll={onScroll}
      >
        {
          assets?.map((asset) => (
            <AssetItem
              {...asset}
              removeAsset={() => handleRemoveAsset(asset.canisterId)}
              key={`${asset.symbol}-${asset.canisterId}-${currentNetwork?.id}`}
              updateToken={handleFetchAssets}
              protectedAsset={!Object.keys(TOKENS).includes(asset.symbol)}
              loading={loading}
              failed={!!asset?.error}
              assetNameTestId="asset-name"
            />
          ))
        }
        <div className={classes.emptyAsset} />
      </div>
      {
        displayCustomToken && (
          <TokenSelector onClose={() => setDisplayCustomToken(false)} />
        )
      }
      <div
        onClick={() => setDisplayCustomToken(!displayCustomToken)}
        className={classes.buttonWrapper}
        data-testid="add-button"
      >
        <Plus size="30" className={classes.icon} strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default Tokens;
