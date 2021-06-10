import React, { useState } from 'react';
import {
  Container, Button, LinkButton, CodeBox, InputBase, Dialog,
} from '@ui';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { QRCode, CopyButton } from '@components';
import { Typography } from '@material-ui/core';
import shortAddress from '@shared/utils/short-address';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/pro-regular-svg-icons/faQrcode';
import useStyles from '../styles';
import { currencyPropTypes } from '../../../../shared/constants/currencies';
import { sourcePropTypes } from '../../../../shared/constants/sources';

const Step2 = ({ selectedSource, selectedAsset }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [openQr, setOpenQr] = useState(false);

  const walletName = 'Main IC Wallet';
  const address = '0xc6e8e3197dac52a68428030463584437227a3e5f';
  const address2 = 'oflzj-g4zss-ac52a68-4280304-63rambd-a38';
  const code = 'dfx canister --no-wallet call $(dfx identity get-wallet) wallet_call "(record { canister=(principal "<dank-canister-id>"); method_name="deposit"; args=(blob "(principal "<user-pulg-principal>")"); cycles=<amount> })"';

  return (
    <Container>
      {
        (selectedSource.id === 'PLUG_ACCOUNT' && selectedAsset.id === 'CYCLES')
        && (
          <Grid container spacing={2} style={{ textAlign: 'center' }}>
            <Grid item xs={12}>
              <QRCode value={address} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h3" className={classes.title}>{walletName}</Typography>
              <Typography variant="subtitle1">{shortAddress(address)}</Typography>
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
        (selectedAsset.id === 'ICP')
        && (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h5">{t('deposit.depositIcpTitle1')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">{t('deposit.depositIcpSubtitle1')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <InputBase>
                <div className={classes.addressContainer}>
                  <Typography variant="h4" style={{ marginRight: 'auto' }}>{shortAddress(address)}</Typography>
                  <FontAwesomeIcon
                    icon={faQrcode}
                    className={classes.icon}
                    onClick={() => setOpenQr(true)}
                  />
                  <CopyButton text={address} placement="top" />
                </div>
              </InputBase>

              <Dialog
                title={t('deposit.scanQrCode')}
                onClose={() => setOpenQr(false)}
                open={openQr}
                component={(
                  <QRCode value={address} style={{ marginBottom: 36 }} />
                )}
              />

            </Grid>
            <Grid item xs={12} className={classes.orContainer}>
              <div className={classes.line} />
              <div className={classes.or}>
                {t('common.or')}
              </div>
              <div className={classes.line} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">{t('deposit.depositIcpTitle2')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">{t('deposit.depositIcpSubtitle2')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <InputBase>
                <div className={classes.addressContainer}>
                  <Typography variant="h4" style={{ marginRight: 'auto' }}>{shortAddress(address2)}</Typography>
                  <CopyButton text={address2} placement="top" />
                </div>
              </InputBase>
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
