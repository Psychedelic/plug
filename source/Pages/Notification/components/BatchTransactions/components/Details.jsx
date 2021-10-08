import React from 'react';
import PropTypes from 'prop-types';
import { IncomingAction, USDFormat } from '@ui';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { CURRENCIES, E8S_PER_ICP } from '@shared/constants/currencies';
import NumberFormat from 'react-number-format';
import extension from 'extensionizer';
import { useICPPrice } from '@redux/icp';
import useStyles from '../styles';
import SIZES from '../constants';

const Details = ({
  amount: e8s, image, url, transactionsCount,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const icpPrice = useICPPrice();

  const asset = CURRENCIES.get('ICP');
  const amount = e8s / E8S_PER_ICP;
  const value = (amount * icpPrice);

  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: transactionsCount > 1
        ? SIZES.detailsHeightBig
        : SIZES.detailsHeightSmall,
    },
  );

  return (
    <div className={classes.innerContainer}>
      <IncomingAction image={image} url={url} action={t('transfer.withdraw')} />

      <div className={classes.cyclesContainer}>
        <Typography variant="h5" component="h4">{t('transfer.amount').replace('{token}', asset.name)}</Typography>

        <div className={classes.amountContainer}>
          <span className={classes.amount}>
            <NumberFormat value={amount} displayType="text" thousandSeparator="," />
            <span className={classes.trillion}>{asset.value}</span>
          </span>
          <Typography variant="subtitle1" className={classes.amountUsd}>
            <USDFormat value={value} />
          </Typography>
        </div>

      </div>
    </div>
  );
};

export default Details;

Details.propTypes = {
  amount: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  transactionsCount: PropTypes.number.isRequired,
};
