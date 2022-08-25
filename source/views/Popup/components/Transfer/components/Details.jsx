import React from 'react';
import PropTypes from 'prop-types';
import { IncomingAction, USDFormat } from '@components';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { CURRENCIES, E8S_PER_ICP } from '@shared/constants/currencies';
import NumberFormat from 'react-number-format';
import extension from 'extensionizer';
import { useICPPrice } from '@redux/icp';
import useStyles from '../styles';
import SIZES from '../constants';

const Details = ({
  amount: e8s, image, url, requestCount, token, strAmount,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const icpPrice = useICPPrice();

  const asset = token;
  const amount = strAmount ? parseFloat(strAmount) : e8s / E8S_PER_ICP;
  const value = asset.symbol === 'ICP' ? (amount * icpPrice) : 0;

  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: requestCount > 1
        ? SIZES.detailsHeightBig
        : SIZES.detailHeightSmall,
    },
  );

  return (
    <div className={classes.innerContainer}>
      <IncomingAction image={image} url={url} action={t('transfer.withdraw')} />

      <div className={classes.cyclesContainer}>
        <Typography variant="h5" component="h4">{t('transfer.amount').replace('{token}', asset.symbol)}</Typography>

        <div className={classes.amountContainer}>
          <span className={classes.amount}>
            <NumberFormat value={amount} displayType="text" thousandSeparator="," />
            <span className={classes.trillion}>{asset.symbol}</span>
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

Details.defaultProps = {
  token: CURRENCIES.get('ICP'),
};

Details.propTypes = {
  token: PropTypes.objectOf(PropTypes.string),
  amount: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  requestCount: PropTypes.number.isRequired,
  strAmount: PropTypes.string.isRequired,
};
