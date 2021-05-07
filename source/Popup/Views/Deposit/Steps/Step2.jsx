import React from 'react';
import {
  Container, Button, LinkButton, CodeBox,
} from '@ui';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { QRCode } from '@components';
import { Typography } from '@material-ui/core';
import { shortenString } from '@shared/helpers/stringHelper';
import { useTranslation } from 'react-i18next';
import useStyles from '../styles';
import { currencyPropTypes } from '../../../../shared/constants/currencies';
import { sourcePropTypes } from '../../../../shared/constants/sources';

const Step2 = ({ selectedSource, selectedAsset }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const walletName = 'Main IC Wallet';
  const address = '0xc6e8e3197dac52a68428030463584437227a3e5f';
  const code = 'dfx canister --no-wallet call $(dfx identity get-wallet) wallet_call "(record { canister=(principal "<dank-canister-id>"); method_name="deposit"; args=(blob "(principal "<user-pulg-principal>")"); cycles=<amount> })"';

  return (
    <Container>
      {
        selectedSource.id === 'PLUG_ACCOUNT'
        && (
          <Grid container spacing={2} style={{ textAlign: 'center' }}>
            <Grid item xs={12}>
              <QRCode value={address} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3" className={classes.title}>{walletName}</Typography>
              <Typography variant="subtitle1">{shortenString(address)}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button variant="rainbow" value={t('deposit.copyAddress')} onClick={() => navigator.clipboard.writeText(address)} />
            </Grid>
            <Grid item xs={12}>
              <LinkButton value={`${t('deposit.learnMore')} ${selectedAsset.name}`} />
            </Grid>
          </Grid>
        )
      }
      {
        selectedSource.id === 'CYCLE_WALLET'
        && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" className={classes.command}>{t('deposit.runCommandTitle')}</Typography>
              <Typography variant="subtitle2">{t('deposit.runCommandSubtitle')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <CodeBox code={code} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="primary" value={t('deposit.runCommandButton')} onClick={() => navigator.clipboard.writeText(address)} fullWidth />
            </Grid>
          </Grid>
        )
      }
    </Container>
  );
};

export default Step2;

Step2.propTypes = {
  selectedSource: PropTypes.shape(sourcePropTypes).isRequired,
  selectedAsset: PropTypes.shape(currencyPropTypes).isRequired,
};
