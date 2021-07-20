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
import { useRouter, Plug } from '@components';

import { ADDRESS_TYPES, DEFAULT_FEE } from '@shared/constants/addresses';
import useStyles from '../styles';

const Step3 = ({
  asset, amount, address, addressInfo, handleSendClick, error, transaction, trxComplete,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { navigator } = useRouter();
  const [accountId, setAccountId] = useState('');

  const [ICPModalOpen, setOpenICPModal] = useState(false);
  const [sendingModalOpen, setSendingModalOpen] = useState(false);

  const subtotal = amount * asset.price;
  const fee = +(asset?.price * DEFAULT_FEE).toFixed(5);

  const shortAddressConfig = {
    leftSize: 8,
    rightSize: 3,
    separator: '...',
    replace: [],
  };

  const openSendModal = () => {
    setOpenICPModal(false);
    setSendingModalOpen(true);
  };

  const onClick = () => {
    setLoading(true);
    openSendModal();
    handleSendClick();
  };

  const redirectToICRocks = () => {
    if (!loading) {
      browser.tabs.create({ url: `https://ic.rocks/account/${accountId}` });
    }
  };

  const openICRocksTx = () => {
    navigator.navigate('home');
    browser.tabs.create({ url: `https://ic.rocks/transaction/${transaction.hash}` });
  };

  const openTwoIdsBlog = () => {
    if (!loading) {
      browser.tabs.create({ url: icIdsUrl });
    }
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

  useEffect(() => {
    if (error) {
      navigator.navigate('error');
    }
  }, [error]);

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
                          {t('common.principalId')}
                        </div>
                      </div>
                      <div className={classes.titleContainer}>
                        <img src={ArrowImg} className={classes.arrow} />
                        <div className={clsx(classes.badge, classes.accountBadge)}>
                          {t('common.accountId')}
                        </div>
                        <Info
                          onClick={() => setOpenICPModal(true)}
                          color="#3574F4"
                          size={16}
                          className={classes.infoIcon}
                        />
                      </div>
                    </div>
                    <div className={classes.addressContainer}>
                      <div className={clsx(classes.flex, classes.margin)}>
                        <Typography
                          variant="subtitle1"
                          className={classes.principalText}
                        >
                          {
                            shortAddress(address, shortAddressConfig)
                          }
                        </Typography>
                      </div>
                      <div className={clsx(classes.flex, classes.margin)}>
                        <Typography variant="subtitle1" className={classes.accountText}>
                          {
                            shortAddress(accountId, shortAddressConfig)
                          }
                        </Typography>
                        <img
                          src={ArrowUpRight}
                          className={classes.arrowUpRight}
                          onClick={redirectToICRocks}
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
                        {t('common.accountId')}
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
          onClose={() => setOpenICPModal(false)}
          open={ICPModalOpen}
          component={(
            <div className={classes.modal}>
              <Typography>{t('send.icpModalText')}</Typography>
              <Button
                variant="rainbow"
                value={t('send.icpModalButton1')}
                onClick={() => setOpenICPModal(false)}
                fullWidth
                disabled={loading}
              />
              <LinkButton
                value={t('send.icpModalButton2')}
                onClick={openTwoIdsBlog}
              />
            </div>
          )}
        />
        <Dialog
          closeable={false}
          open={sendingModalOpen}
          component={(
            <div className={classes.sendingModal}>
              <Plug size="big" message={t(`send.plug${transaction ? 'LetsGo' : 'Chill'}`)} />
              {trxComplete ? (
                <>
                  <Typography className={classes.sendModalTitle}>{t('send.transactionSuccess')}</Typography>
                  <Button
                    variant="rainbow"
                    value={t('send.returnHome')}
                    onClick={() => navigator.navigate('home', 1)}
                    fullWidth
                  />
                  {transaction && <LinkButton onClick={openICRocksTx} value={t('send.viewTxOnICRocks')} />}
                </>
              ) : (
                <>
                  <Typography className={classes.sendModalTitle}>{t('send.transactionInProgress')}</Typography>
                  <Typography className={classes.modalWarning}>{t('send.doNotClose')}</Typography>
                </>
              )}
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

Step3.propTypes = {
  asset: PropTypes.objectOf(PropTypes.object).isRequired,
  amount: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  addressInfo: PropTypes.objectOf(PropTypes.object).isRequired,
  handleSendClick: PropTypes.func.isRequired,
  error: PropTypes.bool,
  transaction: PropTypes.objectOf(PropTypes.string).isRequired,
  trxComplete: PropTypes.bool.isRequired,
};

Step3.defaultProps = {
  error: false,
};

export default Step3;
