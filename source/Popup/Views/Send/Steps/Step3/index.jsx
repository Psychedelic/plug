import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import extension from 'extensionizer';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
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
import { setAssets, setAssetsLoading } from '@redux/wallet';
import { Typography } from '@material-ui/core';
import AccountImg from '@assets/icons/account.svg';
import ArrowImg from '@assets/icons/send-arrow.png';
import shortAddress from '@shared/utils/short-address';
import PlugController from '@psychedelic/plug-controller';
import { Principal } from '@dfinity/principal';
import { Info } from 'react-feather';
import { getICRocksAccountUrl, icIdsUrl } from '@shared/constants/urls';
import ArrowUpRight from '@assets/icons/arrow-up-right.png';
import clsx from 'clsx';
import { useRouter, TokenIcon, TABS } from '@components';

import { ADDRESS_TYPES, DEFAULT_FEE, XTC_FEE } from '@shared/constants/addresses';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { useICPPrice } from '@redux/icp';
import useStyles from '../../styles';

const Step3 = ({
  asset, amount, address, addressInfo, handleSendClick, error, isTrxCompleted,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { navigator } = useRouter();
  const [accountId, setAccountId] = useState('');
  const isICP = asset?.symbol === 'ICP';
  const isXTC = asset?.symbol === 'XTC';
  const dispatch = useDispatch();
  const icpPrice = useICPPrice();

  const [ICPModalOpen, setOpenICPModal] = useState(false);

  const subtotal = amount * asset?.price;
  const fee = +(asset?.price * DEFAULT_FEE).toFixed(5);
  const xtcFee = +(asset?.price * XTC_FEE).toFixed(5);

  const openSendModal = () => {
    setOpenICPModal(false);
  };

  const onClick = () => {
    setLoading(true);
    openSendModal();
    handleSendClick();
  };

  const createICRocksAccountTab = useCallback(() => {
    if (!loading) {
      extension.tabs.create({ url: getICRocksAccountUrl(accountId) });
    }
  }, [loading, accountId]);

  const openTwoIdsBlog = () => {
    if (!loading) {
      extension.tabs.create({ url: icIdsUrl });
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

  useEffect(() => {
    if (isTrxCompleted) {
      dispatch(setAssetsLoading(true));
      sendMessage({
        type: HANDLER_TYPES.GET_ASSETS,
        params: { refresh: true },
      }, (keyringAssets) => {
        dispatch(setAssets({ keyringAssets, icpPrice }));
        dispatch(setAssetsLoading(false));
      });

      setLoading(false);
      navigator.navigate('home', TABS.ACTIVITY);
    }
  }, [isTrxCompleted]);

  return (
    <Container>
      <Grid container spacing={2}>

        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <div className={classes.asset}>
            <TokenIcon image={asset.image} className={classes.image} symbol={asset.symbol} />
            <Typography variant="h1">
              <AssetFormat value={amount} asset={asset?.symbol} />
            </Typography>
          </div>
          <Typography variant="subtitle1">
            <USDFormat value={subtotal} />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            {
              addressInfo.type === ADDRESS_TYPES.PRINCIPAL && isICP
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
                            shortAddress(address)
                          }
                        </Typography>
                      </div>
                      <div className={clsx(classes.flex, classes.margin)}>
                        <Typography variant="subtitle1" className={classes.accountText}>
                          {
                            shortAddress(accountId)
                          }
                        </Typography>
                        <img
                          src={ArrowUpRight}
                          className={classes.arrowUpRight}
                          onClick={createICRocksAccountTab}
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
                        {t(`common.${isICP ? 'accountId' : 'principalId'}`)}
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

        {
          addressInfo.type === ADDRESS_TYPES.PRINCIPAL && asset.symbol === 'ICP'
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
        {isICP && (
          <Grid item xs={12}>
            <InfoRow name={t('common.taxFee')} value={`${DEFAULT_FEE} ICP ($${fee})`} />
          </Grid>
        )}
        {isXTC && (
          <Grid item xs={12}>
            <InfoRow name={t('common.taxFee')} value={`${XTC_FEE} XTC ($${xtcFee})`} />
          </Grid>
        )}
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
  isTrxCompleted: PropTypes.bool.isRequired,
};

Step3.defaultProps = {
  error: false,
};

export default Step3;
