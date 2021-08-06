import React from 'react';
import PropTypes from 'prop-types';
import { IncomingAction, USDFormat } from '@ui';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
// import { CURRENCIES, E8S_PER_ICP } from '@shared/constants/currencies';
import NumberFormat from 'react-number-format';
import extension from 'extensionizer';
import useStyles from '../styles';
import SIZES from '../constants';

const Details = ({
  token, amount, image, url, requestCount, price = 10,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  // const amount = e8s / E8S_PER_ICP;
  const total = (amount * price);

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
        <Typography variant="h4">{t('transfer.amount').replace('{token}', token.name)}</Typography>

        <div className={classes.amountContainer}>
          <span className={classes.amount}>
            <NumberFormat value={amount} displayType="text" thousandSeparator="," />
            <span className={classes.trillion}>{token.symbol}</span>
          </span>
          <Typography variant="subtitle1">
            <USDFormat value={total} />
          </Typography>
        </div>

      </div>
    </div>
  );
};

export default Details;

Details.propTypes = {
  token: PropTypes.objectOf(PropTypes.object).isRequired,
  amount: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  requestCount: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
};
