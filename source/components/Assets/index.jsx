import React from 'react';
import { AssetItem, Button } from '@ui';
import { CURRENCIES } from '@shared/constants/currencies';
import { useRouter } from '@components/Router';

import { useTranslation } from 'react-i18next';
import useStyles from './styles';

const ASSETS = [
  {
    image: CURRENCIES.get('ICP').image,
    name: CURRENCIES.get('ICP').name,
    amount: 152.28,
    value: 12183.29,
    currency: CURRENCIES.get('ICP').value,
  },
  {
    image: CURRENCIES.get('CYCLES').image,
    name: CURRENCIES.get('CYCLES').name,
    amount: 102.2913,
    value: 102.30,
    currency: CURRENCIES.get('CYCLES').value,
  },
];

const Assets = () => {
  const classes = useStyles();
  const { navigator } = useRouter();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      {
        ASSETS.map((asset) => (
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
