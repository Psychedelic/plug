import React, { useEffect } from 'react';
import { AssetItem, Button } from '@ui';
import { useRouter } from '@components/Router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getAssets } from '../../redux/wallet';
import useStyles from './styles';

const Assets = () => {
  const classes = useStyles();
  const { navigator } = useRouter();
  const { t } = useTranslation();

  const { assets } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAssets());
  }, []);

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
