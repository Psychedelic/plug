import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import XTCIcon from '@assets/icons/XTC.svg';
import {
  Button, Container, USDFormat, AssetFormat,

} from '@ui';
import { TokenIcon } from '@components';
import { USD_PER_TC } from '@shared/constants/currencies';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { setAssets, setAssetsLoading } from '@redux/wallet';
import { useDispatch } from 'react-redux';
import useStyles from '../styles';

const cyclesToTC = cycles => cycles ? cycles / 1_000_000_000_000 : 0; // eslint-disable-line

const parseTokenBySymbol = (token) => ({
  XTC: {
    ...token?.token,
    amount: cyclesToTC(token.amount),
    image: XTCIcon,
    price: cyclesToTC(token.amount) * USD_PER_TC,
  },
  WTC: {
    ...token?.token,
    amount: cyclesToTC(token.amount),
    price: cyclesToTC(token.amount) * USD_PER_TC,
  },
})[token?.token?.symbol] || token;

const Step2 = ({ selectedToken, handleClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const displayToken = parseTokenBySymbol(selectedToken);
  const registerToken = () => {
    setLoading(true);
    sendMessage({
      type: HANDLER_TYPES.ADD_CUSTOM_TOKEN,
      params: selectedToken?.token.canisterId,
    }, async () => {
      sendMessage({
        type: HANDLER_TYPES.GET_BALANCE,
      }, (keyringAssets) => {
        dispatch(setAssets(keyringAssets));
        dispatch(setAssetsLoading(false));
        setLoading(false);
        handleClose();
      });
    });
  };
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">{t('addToken.confirmText')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.confirmToken}>
            <TokenIcon
              image={displayToken.image}
              className={classes.tokenImage}
              symbol={displayToken?.symbol}
            />
            <div className={classes.leftContainer}>
              <Typography variant="h4">{displayToken.name}</Typography>
              <Typography variant="subtitle1"><AssetFormat value={displayToken?.amount} asset={displayToken?.symbol} /></Typography>
            </div>
            {!!displayToken.price && (
              <div className={classes.rightContainer}>
                <Typography variant="h4"><USDFormat value={displayToken?.price} /></Typography>
              </div>
            )}
          </div>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('common.add')}
            onClick={registerToken}
            loading={loading}
            disabled={loading}
            fullWidth
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step2;

Step2.propTypes = {
  selectedToken: PropTypes.objectOf(PropTypes.object).isRequired,
  handleClose: PropTypes.func.isRequired,
};
