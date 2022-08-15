import React, { useState } from 'react';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';

import { useRouter } from '@components/Router';
import {
  QRCode, CopyButton, IconQrCode, Layout,

  Header, LinkButton, InputBase, Dialog, Container,
} from '@components';
import shortAddress from '@shared/utils/short-address';
import useStyles from './styles';

const Deposit = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { navigator } = useRouter();
  const [openQr, setOpenQr] = useState(false);
  const { principalId, accountId } = useSelector((state) => state.wallet);

  return (
    <Layout>
      <Header
        left={null}
        center={t('deposit.title')}
        right={
          <LinkButton value={t('common.done')} onClick={() => navigator.navigate('home')} />
        }
      />
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5">{t('deposit.depositIcpTitle1')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" data-testid="deposit-principalId-subtitle">{t('deposit.depositIcpSubtitle1')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <InputBase>
              <div className={classes.addressContainer}>
                <Typography variant="h4" style={{ marginRight: 'auto' }}>{shortAddress(principalId)}</Typography>
                <div className={clsx(classes.badge, classes.principalBadge)}>
                  {t('common.principalId')}
                </div>
                <IconQrCode
                  onClick={() => setOpenQr(true)}
                  classes={classes}
                  data-testid="qr-code-icon-button"
                />
                <CopyButton text={principalId} placement="top" data-testid="copy-principalId-button" />
              </div>
            </InputBase>

            <Dialog
              title={t('deposit.scanQrCode')}
              onClose={() => setOpenQr(false)}
              open={openQr}
              closeIconButtonTestId="close-qr-code-modal-button"
              component={(
                <QRCode value={principalId} style={{ marginBottom: 36 }} />
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
            <Typography variant="subtitle2" data-testid="deposit-accountId-subtitle">{t('deposit.depositIcpSubtitle2')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <InputBase>
              <div className={classes.addressContainer}>
                <Typography variant="h4" style={{ marginRight: 'auto' }}>{shortAddress(accountId)}</Typography>
                <div className={clsx(classes.badge, classes.accountBadge)}>
                  {t('common.accountId')}
                </div>
                <CopyButton text={accountId} placement="top" data-testid="copy-accountId-button" />
              </div>
            </InputBase>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Deposit;
