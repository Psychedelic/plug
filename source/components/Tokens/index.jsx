import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AssetItem } from '@ui';
import { setAssets, setAssetsLoading } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { useRouter } from '@components/Router';
import { useICPPrice } from '@redux/icp';
import plusIcon from '@assets/icons/white-plus.svg';
import useStyles from './styles';

const Tokens = () => {
  const classes = useStyles();
  const { assets, assetsLoading } = useSelector((state) => state.wallet);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const icpPrice = useICPPrice();
  const { navigator } = useRouter();

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

  return (
    <div className={classes.root}>
      <div className={classes.tokenContainer}>
        {
          assets?.map((asset) => (
            <AssetItem {...asset} key={asset.name} loading={loading} />
          ))
        }
      </div>
      <div
        className={classes.buttonWrapper}
        onClick={() => navigator.navigate('add-token')}
      >
        <img src={plusIcon} />
      </div>
    </div>
  );
};

export default Tokens;
