import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { TokenIcon } from '@components';
import RefreshIcon from '@assets/icons/blue-refresh.png';

import useStyles from './styles';

const AssetItem = ({
  updateToken, logo, name, amount, value, symbol, loading, failed, assetNameTestId,
}) => {
  const classes = useStyles();
  const [fetchLoading, setFetchLoading] = useState(false);
  const { t } = useTranslation();
  const { currentNetwork, usingMainnet } = useSelector((state) => state.network);

  const handleFetchAssets = async () => {
    // Avoid calling multiple times
    if (fetchLoading) return;

    setFetchLoading(true);
    await updateToken();
    setFetchLoading(false);
  };
  const ledgerNotSpecified = !usingMainnet && !currentNetwork?.ledgerCanisterId;
  return (
    <div className={clsx(classes.root, failed && classes.failedContainer)}>
      <TokenIcon className={classes.image} logo={logo} alt={name} symbol={symbol} />
      <div className={classes.leftContainer}>
        {failed && !loading
          ? (
            <>
              <Typography variant="h5" className={classes.failedTitle}>{name}</Typography>
              <Typography variant="subtitle2" className={classes.failedDescription}>
                {t(`tokens.${ledgerNotSpecified && name === 'ICP' ? 'ledgerNotSpecified' : 'failedToFetchBalance'}`)}
              </Typography>
            </>
          )
          : (
            <>
              <Typography variant="h5" data-testid={`${assetNameTestId}-${name}`}>{name || <Skeleton />}</Typography>
              <Typography variant="subtitle2" className={clsx(loading && classes.pulse)}>
                {loading
                  ? <Skeleton />
                  : (
                    <NumberFormat
                      value={amount}
                      displayType="text"
                      decimalScale={5}
                      fixedDecimalScale
                      thousandSeparator=","
                      suffix={` ${symbol}`}
                      data-testid={`asset-amount-${name}`}
                    />
                  )}
              </Typography>
            </>
          )}
      </div>
      {failed && !loading
        ? !ledgerNotSpecified && (
        <img
          className={clsx(classes.value, classes.refresh)}
          src={RefreshIcon}
          onClick={handleFetchAssets}
        />
        )
        : !!value && (
        <Typography variant="h5" className={clsx(classes.value, (loading) && classes.pulse)}>
          {loading
            ? <Skeleton className={classes.valueSkeleton} />
            : (<NumberFormat value={value} displayType="text" decimalScale={2} fixedDecimalScale thousandSeparator="," prefix="$" />)}
        </Typography>
        )}

    </div>

  );
};

export default AssetItem;

AssetItem.defaultProps = {
  failed: true,
  assetNameTestId: '',
};

AssetItem.propTypes = {
  updateToken: PropTypes.func.isRequired,
  logo: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  symbol: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  failed: PropTypes.bool,
  assetNameTestId: PropTypes.string,
};
