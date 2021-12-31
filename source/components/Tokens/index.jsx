import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { AssetItem, Button } from '@ui';
import { setAssets, setAssetsLoading } from '@redux/wallet';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { useRouter } from '@components/Router';
import { useICPPrice } from '@redux/icp';
import { ActionDialog } from '@components';
import useStyles from './styles';

const Tokens = () => {
  const classes = useStyles();
  const { assets, assetsLoading, walletNumber } = useSelector((state) => state.wallet);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const icpPrice = useICPPrice();
  const { t } = useTranslation();
  const { navigator } = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

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

  const handleDelete = (asset) => {
    const filtered = assets.filter((item) => item.symbol !== asset.symbol);
    dispatch(setAssets({ keyringAssets: filtered, icpPrice }));

    sendMessage({
      type: HANDLER_TYPES.REMOVE_CUSTOM_TOKEN,
      params: { canisterId: asset.canisterId, walletNumber },
    }, (newAssets) => {
      dispatch(setAssets({ keyringAssets: newAssets, icpPrice }));
    });

    setOpen(false);
  };

  const onDelete = (asset) => {
    setSelectedAsset(asset);
    setOpen(true);
  };

  return (
    <div className={classes.root}>
      <div className={classes.tokenContainer}>
        {
          assets?.map((asset) => (
            <AssetItem
              asset={asset}
              key={asset.name}
              loading={loading}
              onDelete={onDelete}
            />
          ))
        }
      </div>
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
      {
        open
        && (
          <ActionDialog
            open={open}
            title={t('assets.removeTokenTitle')}
            content={<Typography>{t('assets.removeTokenText')} <b>{selectedAsset.symbol}</b>?</Typography>}
            button={t('common.remove')}
            buttonVariant="danger"
            onClick={() => handleDelete(selectedAsset)}
            onClose={() => setOpen(false)}
          />
        )
      }
    </div>
  );
};

export default Tokens;
