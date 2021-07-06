import React, { useState } from 'react';
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
} from '@ui';
import { Typography } from '@material-ui/core';
import AccountImg from '@assets/icons/account.svg';
import ArrowImg from '@assets/icons/send-arrow.png';
import shortAddress from '@shared/utils/short-address';
import PlugController from '@psychedelic/plug-controller';
import { Principal } from '@dfinity/agent';
import useStyles from '../styles';
import { ADDRESS_TYPES, DEFAULT_FEE } from '../hooks/constants';

const Step3 = ({
  asset, amount, address, addressInfo, handleSendClick,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const subtotal = amount * asset.price;
  const fee = +(asset?.price * DEFAULT_FEE).toFixed(5);

  const onClick = () => {
    setLoading(true);
    handleSendClick();
  };

  return (
    <Container>
      <Grid container spacing={2}>

        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Typography variant="h1" style={{ marginBottom: 3 }}>
            <AssetFormat value={amount} asset={asset.value} />
          </Typography>
          <Typography variant="subtitle1">
            <USDFormat value={subtotal} />
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <InfoRow name={t('send.payWith')} value={asset.name} image={asset.image} border spaced />
            {
              addressInfo.type === ADDRESS_TYPES.PRINCIPAL
                ? (
                  <div className={classes.accountIdContainer}>
                    <div>
                      <Typography variant="subtitle1">{t('send.to')}</Typography>
                      <div className={classes.titleContainer}>
                        <img src={ArrowImg} className={classes.arrow} />
                        <Typography variant="subtitle1">{t('send.accountId')}</Typography>
                      </div>
                    </div>
                    <div className={classes.addressContainer}>
                      <div className={classes.flex}>
                        <img className={classes.image} src={AccountImg} />
                        <Typography variant="h5">{shortAddress(address)}</Typography>
                      </div>
                      <div className={classes.flex}>
                        <img className={classes.image} src={AccountImg} />
                        <Typography variant="h5">
                          {
                            shortAddress(
                              PlugController.getAccountId(
                                Principal.fromText(address),
                              ),
                            )
                          }
                        </Typography>
                      </div>
                    </div>
                  </div>
                )
                : <InfoRow name={t('send.to')} value={shortAddress(address)} image={AccountImg} spaced />
            }
          </Card>
        </Grid>

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
