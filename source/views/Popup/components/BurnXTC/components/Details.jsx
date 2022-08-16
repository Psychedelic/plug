import React from 'react';
import PropTypes from 'prop-types';
import { IncomingAction } from '@components';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { CURRENCIES, CYCLES_PER_TC } from '@shared/constants/currencies';
import shortAddress from '@shared/utils/short-address';
import NumberFormat from 'react-number-format';
import extension from 'extensionizer';
import useStyles from '../styles';
import SIZES from '../constants';

const Details = ({
  canisterId, amount: cycles, image, url,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const asset = CURRENCIES.get('XTC');
  const amount = cycles / CYCLES_PER_TC;

  extension.windows.update(
    extension.windows.WINDOW_ID_CURRENT,
    {
      height: SIZES.detailHeight,
    },
  );

  return (
    <div className={classes.detailsInnerContainer}>
      <IncomingAction image={image} url={url} action={t('burn.title')} />
      <div className={classes.rowContainer}>
        <Typography variant="h4">{t('burn.amount').replace('{token}', asset.name)}</Typography>
        <div className={classes.amountContainer}>
          <span className={classes.amount}>
            <NumberFormat value={amount} displayType="text" thousandSeparator="," />
            <span className={classes.trillion}>{asset.value}</span>
          </span>
        </div>
      </div>
      <div className={classes.rowContainer}>
        <Typography variant="h4">{t('burn.canister')}</Typography>
        <Typography variant="h3">{shortAddress(canisterId)}</Typography>
      </div>
    </div>
  );
};

export default Details;

Details.propTypes = {
  amount: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  canisterId: PropTypes.string.isRequired,
};
