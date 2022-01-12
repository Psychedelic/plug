import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { updateBalance } from '@redux/wallet';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { TokenIcon } from '@components';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

import useStyles from './styles';

const AssetItem = ({
  image, name, amount, value, symbol, loading, token, error,
}) => {
  const [assetLoading, setLoading] = useState(loading);
  const classes = useStyles();
  const dispatch = useDispatch();
  const refreshBalance = () => {
    setLoading(true);
    sendMessage({
      type: HANDLER_TYPES.UPDATE_BALANCE,
      params: token,
    }, (tokenBalance) => {
      dispatch(updateBalance(tokenBalance));
      setLoading(false);
    });
  };

  useEffect(() => { setLoading(loading); }, [loading]);
  return (
    <div className={classes.root} onClick={refreshBalance}>
      <TokenIcon className={classes.image} image={image} alt={name} symbol={symbol} />
      <div className={classes.leftContainer}>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="subtitle2" className={clsx(assetLoading && classes.pulse)}>
          <NumberFormat value={amount} displayType="text" decimalScale={5} fixedDecimalScale thousandSeparator="," suffix={` ${symbol}`} />
        </Typography>
      </div>
      {!!value && (
        <Typography variant="h5" className={clsx(classes.value, (assetLoading) && classes.pulse)}>
          <NumberFormat value={value} displayType="text" decimalScale={2} fixedDecimalScale thousandSeparator="," prefix="$" />
        </Typography>
      )}
    </div>
  );
};

export default AssetItem;

AssetItem.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};
