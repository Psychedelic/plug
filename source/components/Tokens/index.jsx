import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'react-feather';
import { AssetItem } from '@ui';
import { setAssets, setAssetsLoading } from '@redux/wallet';
import clsx from 'clsx';

import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { useRouter } from '@components/Router';
import { AMOUNT_ERROR } from '@shared/constants/currencies';
import { useICPPrice } from '@redux/icp';
import { setICNSData } from '@redux/icns';
import { useScroll } from '@hooks';

import useStyles from './styles';

const Tokens = () => {
  const classes = useStyles();
  const { assets, assetsLoading } = useSelector((state) => state.wallet);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const icpPrice = useICPPrice();
  const { navigator } = useRouter();
  const { onScroll, fullScroll } = useScroll();

  const fetchAssets = () => {
    if (icpPrice) {
      sendMessage({
        type: HANDLER_TYPES.GET_ASSETS,
        params: {},
      }, (keyringAssets) => {
        dispatch(setAssets({ keyringAssets, icpPrice }));
        dispatch(setAssetsLoading(false));
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    const id = setInterval(fetchAssets, 15000);
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
              updateToken={fetchAssets}
              key={asset.name}
              loading={loading}
              failed={asset.amount === AMOUNT_ERROR}
            />
          ))
        }
      </div>
      <div
        onClick={() => navigator.navigate('add-token')}
        className={classes.buttonWrapper}
      >
        <Plus size="30" className={classes.icon} strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default Tokens;
