import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { TokenIcon } from '@components';
import { Trash2 } from 'react-feather';

import useStyles from './styles';

const AssetItem = ({
  asset, loading, onDelete,
}) => {
  const { image, name, amount, value, symbol } = asset;
  const classes = useStyles();
  const [hover, setHover] = useState(false);

  return (
    <div className={classes.root}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <TokenIcon className={classes.image} image={image} alt={name} symbol={symbol} />
      <div className={classes.leftContainer}>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="subtitle2" className={clsx(loading && classes.pulse)}>
          <NumberFormat value={amount} displayType="text" decimalScale={5} fixedDecimalScale thousandSeparator="," suffix={` ${symbol}`} />
        </Typography>
      </div>
      {
        (hover && onDelete && !['ICP', 'XTC'].includes(asset.symbol)) // this could be more generic but 30/12 kekw
          ?
          <Trash2
            className={classes.deleteIcon}
            onClick={() => onDelete(asset)}
            size="18"
          />
          :
          <Typography variant="h5" className={clsx(classes.value, (loading) && classes.pulse)}>
            <NumberFormat value={value} displayType="text" decimalScale={2} fixedDecimalScale thousandSeparator="," prefix="$" />
          </Typography>
      }
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
