/* import React from 'react';
import { IncomingAction, USDFormat, AssetFormat } from '@ui';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { CURRENCIES } from '@shared/constants/currencies';
import useStyles from '../styles';

const Data = ({ cycles, image, url }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const asset = CURRENCIES.get('CYCLES');
  const value = cycles * asset.price;

  return (
    <div className={classes.innerContainer}>
      <IncomingAction image={image} url={url} action={t('cycleTransactions.withdraw')} />

      <div className={classes.cyclesContainer}>
        <Typography variant="h3">{t('cycleTransactions.amount')}</Typography>

        <div className={classes.amountContainer}>
          <span className={classes.amount}><AssetFormat value={cycles} asset={asset} /></span>
          <Typography variant="subtitle1"><USDFormat value={value} /></Typography>
        </div>

      </div>
    </div>
  );
};

export default Data;
*/
