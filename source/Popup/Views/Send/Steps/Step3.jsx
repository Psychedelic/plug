import React from 'react';
import {
  Container,
  InfoRow,
  Button,
  Card,
  AssetFormat,
  USDFormat,
} from '@ui';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import AccountImg from '@assets/icons/account.svg';
import PropTypes from 'prop-types';
import useStyles from '../styles';

const Step3 = ({
  asset, amount, address, handleSendClick,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const subtotal = amount * asset.price;

  return (
    <Container>
      <div className={classes.reviewContainer}>
        <div>
          <Typography variant="h1" style={{ marginBottom: 3 }}>
            <AssetFormat value={amount} asset={asset} />
          </Typography>
          <Typography variant="subtitle1">
            <USDFormat value={subtotal} />
          </Typography>
        </div>

        <Card>
          <InfoRow name={t('send.payWith')} value={asset.name} image={asset.image} border spaced />
          <InfoRow name={t('send.to')} value={address} image={AccountImg} spaced />
        </Card>

        <InfoRow name={t('common.taxFee')} value="0.00005 T Cycles ($2.50)" />
        <InfoRow name={t('common.total')} value={<USDFormat value={subtotal + 2.5} />} total />

        <Button variant="rainbow" value={t('send.title')} onClick={handleSendClick} fullWidth />
      </div>
    </Container>
  );
};

export default Step3;

Step3.propTypes = {
  asset: PropTypes.objectOf(PropTypes.object).isRequired,
  amount: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  handleSendClick: PropTypes.func.isRequired,
};
