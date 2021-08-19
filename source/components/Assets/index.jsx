import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AssetItem, Button } from '@ui';
import { setAssets } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import LoadingWrapper from '@components/LoadingWrapper';
import { useRouter } from '@components/Router';
import useStyles from './styles';

const Assets = () => {
  const classes = useStyles();
  const { assets } = useSelector((state) => state.wallet);
  const [assetsLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { icpPrice } = useSelector((state) => state.icp);
  const { t } = useTranslation();
  const { navigator } = useRouter();
  useEffect(() => {
    if (icpPrice) {
      sendMessage({
        type: HANDLER_TYPES.GET_ASSETS,
        params: icpPrice,
      }, (keyringAssets) => {
        dispatch(setAssets(keyringAssets));
        setLoading(false);
      });
    }
  }, [icpPrice]);
  console.log(assets);
  return (
    <LoadingWrapper loading={!assets?.length && assetsLoading}>
      <div className={classes.root}>
        {
        assets?.map((asset) => (
          <AssetItem {...asset} key={asset.name} />
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
              marginTop: 12,
            }}
          />
        </div>
      </div>
    </LoadingWrapper>
  );
};

export default Assets;
