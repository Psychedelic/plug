import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AssetItem, Button } from '@ui';
import { setAssets, setAssetsLoading } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { useRouter } from '@components/Router';
import { useICPPrice } from '@redux/icp';
import useStyles from './styles';

const Tokens = () => {
  const classes = useStyles();
  const { assets, assetsLoading } = useSelector((state) => state.wallet);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const icpPrice = useICPPrice();
  const { t } = useTranslation();
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
      {
          assets?.map((asset) => (
            <AssetItem {...asset} key={asset.name} loading={loading} />
          ))
        }
      <div className={classes.buttonWrapper}>
        <Button
          variant="rainbowOutlined"
          value={t('addToken.title')}
          onClick={() => navigator.navigate('add-token')}
          style={{
            width: 166,
            height: 42,
            borderRadius: 10,
            alignSelf: 'center',
          }}
        />
      </div>
    </div>
  );
};

export default Tokens;
