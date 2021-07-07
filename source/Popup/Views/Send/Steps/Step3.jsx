import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import {
  Container,
  InfoRow,
  Button,
  Card,
  AssetFormat,
  USDFormat,
  Dialog,
  LinkButton,
} from '@ui';
import { Typography } from '@material-ui/core';
import AccountImg from '@assets/icons/account.svg';
import ArrowImg from '@assets/icons/send-arrow.png';
import shortAddress from '@shared/utils/short-address';
import PlugController from '@psychedelic/plug-controller';
import { Principal } from '@dfinity/agent';
import { Info } from 'react-feather';
import { icIdsUrl } from '@shared/constants/urls';
import browser from 'webextension-polyfill';
import ArrowUpRight from '@assets/icons/arrow-up-right.png';
import clsx from 'clsx';
import { ADDRESS_TYPES, DEFAULT_FEE } from '../hooks/constants';
import useStyles from '../styles';

const openTwoIdsBlog = () => browser.tabs.create({ url: icIdsUrl });

const Step3 = ({
  asset, amount, address, addressInfo, handleSendClick,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState('');

  const [open, setOpen] = useState(false);

  const subtotal = amount * asset.price;
  const fee = +(asset?.price * DEFAULT_FEE).toFixed(5);

  const onClick = () => {
    setLoading(true);
    handleSendClick();
  };

  useEffect(() => {
    if (addressInfo.type === ADDRESS_TYPES.PRINCIPAL) {
      setAccountId(
        PlugController.getAccountId(
          Principal.fromText(address),
        ),
      );
    }
  }, []);

  return (
    <Container>
      <Grid container spacing={2}>

        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <div className={classes.asset}>
            <img src={asset.image} className={classes.image} />
            <Typography variant="h1">
              <AssetFormat value={amount} asset={asset.value} />
            </Typography>
          </div>
          <Typography variant="subtitle1">
            <USDFormat value={subtotal} />
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Card>
            {
              addressInfo.type === ADDRESS_TYPES.PRINCIPAL
                ? (
                  <div className={classes.accountIdContainer}>
                    <div>
                      <div className={classes.flex}>
                        <Typography variant="subtitle1" className={classes.to}>{t('send.to')}</Typography>
                        <div className={clsx(classes.badge, classes.principalBadge)}>
                          {t('send.principalId')}
                        </div>
                      </div>
                      <div className={classes.titleContainer}>
                        <img src={ArrowImg} className={classes.arrow} />
                        <div className={clsx(classes.badge, classes.accountBadge)}>
                          {t('send.accountId')}
                        </div>
                        <Info
                          onClick={() => setOpen(true)}
                          color="#3574F4"
                          size={16}
                          className={classes.infoIcon}
                        />
                      </div>
                    </div>
                    <div className={classes.addressContainer}>
                      <div className={clsx(classes.flex, classes.margin)}>
                        <img className={classes.image} src={AccountImg} />
                        <Typography variant="subtitle1" className={classes.principalText}>{shortAddress(address)}</Typography>
                      </div>
                      <div className={clsx(classes.flex, classes.margin)}>
                        <img className={classes.image} src={AccountImg} />
                        <Typography variant="subtitle1" className={classes.accountText}>
                          {
                            shortAddress(accountId)
                          }
                        </Typography>
                        <img
                          src={ArrowUpRight}
                          className={classes.arrowUpRight}
                          onClick={() => browser.tabs.create({ url: `https://ic.rocks/account/${accountId}` })}
                        />
                      </div>
                    </div>
                  </div>
                )
                : (
                  <div className={classes.accountIdContainer}>
                    <div className={classes.flex}>
                      <Typography variant="subtitle1" className={classes.to}>{t('send.to')}</Typography>
                      <div className={clsx(classes.badge, classes.accountBadge)}>
                        {t('send.accountId')}
                      </div>
                    </div>
                    <div className={classes.flex}>
                      <img src={AccountImg} className={classes.image} />
                      <Typography variant="h6">{shortAddress(address)}</Typography>
                    </div>
                  </div>
                )
            }
          </Card>
        </Grid>

        <Dialog
          title={t('send.icpModalTitle')}
          onClose={() => setOpen(false)}
          open={open}
          component={(
            <div className={classes.modal}>
              <Typography>{t('send.icpModalText')}</Typography>
              <Button variant="rainbow" value={t('send.icpModalButton1')} onClick={() => setOpen(false)} fullWidth />
              <LinkButton
                value={t('send.icpModalButton2')}
                onClick={openTwoIdsBlog}
              />
            </div>
          )}
        />

        {
          addressInfo.type === ADDRESS_TYPES.PRINCIPAL
          && (
          <Grid item xs={12}>
            <div className={classes.alertContainer}>
              <span>{t('send.icpAlertText')}</span>
              <span
                className={classes.alertButton}
                onClick={openTwoIdsBlog}
              >
                {t('send.icpAlertButton')}
              </span>
            </div>
          </Grid>
          )
        }

        <Grid item xs={12}>
          <InfoRow name={t('common.taxFee')} value={`${DEFAULT_FEE} ICP ($${fee})`} />
        </Grid>

        <Grid item xs={12}>
          <InfoRow name={t('common.total')} value={<USDFormat value={subtotal + fee} />} total />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('send.title')}
            onClick={onClick}
            fullWidth
            loading={loading}
          />
        </Grid>

      </Grid>
    </Container>
  );
};

export default Step3;

Step3.propTypes = {
  asset: PropTypes.objectOf(PropTypes.object).isRequired,
  amount: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  addressInfo: PropTypes.objectOf(PropTypes.object).isRequired,
  handleSendClick: PropTypes.func.isRequired,
};
