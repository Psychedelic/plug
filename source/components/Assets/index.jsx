import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import extension from 'extensionizer';
import { AssetItem, Button } from '@ui';
import { useRouter } from '@components/Router';
import { setAssets } from '@redux/wallet';
import { HANDLER_TYPES } from '@background/Keyring';

import { useTranslation } from 'react-i18next';
import useStyles from './styles';

const Assets = () => {
  const classes = useStyles();
  const { navigator } = useRouter();
  const { t } = useTranslation();

  const { assets } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();
  const { icpPrice } = useSelector((state) => state.icp);

  useEffect(() => {
    if (icpPrice) {
      extension.runtime.sendMessage({
        type: HANDLER_TYPES.GET_ASSETS,
        params: icpPrice,
      }, (keyringAssets) => dispatch(setAssets(keyringAssets)));
    }
  }, [icpPrice]);
  return (
    <div className={classes.root}>
      {
        assets.map((asset) => (
          <AssetItem {...asset} />
        ))
      }
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
  );
};

export default Assets;
