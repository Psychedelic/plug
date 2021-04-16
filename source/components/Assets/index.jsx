import React from 'react';
import { AssetItem } from '@ui';
import { CURRENCIES } from '@shared/constants/currencies';
import useStyles from './styles';

const ASSETS = [
  {
    image: CURRENCIES.ICP.image,
    name: CURRENCIES.ICP.displayName,
    amount: 152.28,
    value: 12183.29,
    currency: CURRENCIES.ICP.value,
  },
  {
    image: CURRENCIES.CYCLES.image,
    name: CURRENCIES.CYCLES.displayName,
    amount: 102.2913,
    value: 102.30,
    currency: CURRENCIES.CYCLES.value,
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
