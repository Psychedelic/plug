import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { TokenIcon } from '@components';
import RefreshIcon from '@assets/icons/blue-refresh.png';

import { useTranslation } from 'react-i18next';
import useStyles from './styles';

const AssetItem = ({
  image, name, amount, value, symbol, loading, failed,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={clsx(classes.root, failed && classes.failedContainer)}>
      <TokenIcon className={classes.image} image={image} alt={name} symbol={symbol} />
      <div className={classes.leftContainer}>
        {
          failed
            ? (
              <>
                <Typography variant="h5" className={classes.failedTitle}>{name}</Typography>
                <Typography variant="subtitle2" className={classes.failedDescription}>
                  {t('tokens.failedToFetchBalance')}
                </Typography>
              </>
            )
            : (
              <>
                <Typography variant="h5">{name}</Typography>
                <Typography variant="subtitle2" className={clsx(loading && classes.pulse)}>
                  <NumberFormat value={amount} displayType="text" decimalScale={5} fixedDecimalScale thousandSeparator="," suffix={` ${symbol}`} />
                </Typography>
              </>
            )
}
      </div>
      {
        failed
          ? (
            <img
              className={clsx(classes.value, classes.refresh)}
              src={RefreshIcon}
              onClick={() => null}
            />
          )
          : !!value && (
            <Typography variant="h5" className={clsx(classes.value, (loading) && classes.pulse)}>
              <NumberFormat value={value} displayType="text" decimalScale={2} fixedDecimalScale thousandSeparator="," prefix="$" />
            </Typography>
          )
      }
    </div>
  );
};

export default AssetItem;

AssetItem.defaultProps = {
  failed: true,
};

AssetItem.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  failed: PropTypes.bool,
};
