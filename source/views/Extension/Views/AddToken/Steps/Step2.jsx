import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import XTCIcon from '@assets/icons/XTC.svg';
import {
  Button, Container, USDFormat, AssetFormat,
  TokenIcon,
} from '@components';
import { USD_PER_TC, CYCLES_PER_TC } from '@shared/constants/currencies';
import { useICPPrice } from '@redux/icp';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { setAssets, setAssetsLoading } from '@redux/wallet';
import { useDispatch } from 'react-redux';

import useStyles from '../styles';

const cyclesToTC = cycles => cycles ? cycles / CYCLES_PER_TC : 0; // eslint-disable-line

const parseTokenBySymbol = (token) => ({
  XTC: {
    ...token?.token,
    amount: cyclesToTC(token.amount),
    logo: XTCIcon,
    price: cyclesToTC(token.amount) * USD_PER_TC,
  },
  WTC: {
    ...token?.token,
    amount: cyclesToTC(token.amount),
    price: cyclesToTC(token.amount) * USD_PER_TC,
  },
})[token?.token?.symbol] || {
  ...token?.token,
  amount: token?.amount?.value / (10 ** token?.amount?.decimals),
};

const Step2 = ({ selectedToken, handleClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const displayToken = parseTokenBySymbol(selectedToken);
  const icpPrice = useICPPrice();

  const registerToken = () => {
    setLoading(true);
    sendMessage({
      type: HANDLER_TYPES.ADD_CUSTOM_TOKEN,
      params: selectedToken?.token,
    }, async () => {
      sendMessage({
        type: HANDLER_TYPES.GET_ASSETS,
        params: { refresh: true },
      }, (keyringAssets) => {
        dispatch(setAssets({ keyringAssets, icpPrice }));
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
              logo={displayToken.logo}
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
            data-testid="add-button"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step2;

Step2.propTypes = {
  selectedToken: PropTypes.objectOf(PropTypes.string).isRequired,
  handleClose: PropTypes.func.isRequired,
};
