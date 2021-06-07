import React from 'react';
import { AssetItem } from '@ui';
import { CURRENCIES } from '@shared/constants/currencies';
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

  return (
    <div className={classes.root}>
      {
        ASSETS.map((asset) => (
          <AssetItem {...asset} />
        ))
      }
    </div>
  );
};

export default Assets;
