import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { IDInput } from '@components';
import {
  FormItem, MultiInput, Container, Button, Dialog, Alert,
} from '@ui';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { ADDRESS_TYPES } from '@shared/constants/addresses';
import { isICNSName } from '@shared/utils/ids';

import useStyles from '../styles';

const Step1 = ({
  amount,
  handleChangeAmount,
  handleChangeStep,
  assets,
  selectedAsset,
  availableAmount,
  primaryValue,
  secondaryValue,
  conversionPrice,
  handleSwapValues,
  handleChangeAsset,
  address,
  handleChangeAddress,
  addressInfo,
  loadingAddress,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [openAssets, setOpenAssets] = useState(false);

  const { principalId, accountId } = useSelector((state) => state.wallet);

  const isUserAddress = [principalId, accountId].includes(address);

  const handleCloseAssets = (value) => {
    setOpenAssets(false);
    handleChangeAsset(value);
  };
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            label={t('send.asset')}
            component={(
              <MultiInput
                name={selectedAsset?.symbol}
                image={selectedAsset?.image}
                onClick={() => setOpenAssets(true)}
                value={amount.toFixed(6).slice(0, -1)}
                onChange={handleChangeAmount}
                primaryValue={primaryValue}
                secondaryValue={secondaryValue}
                conversionPrice={conversionPrice}
                handleSwapValues={handleSwapValues}
                availableAmount={availableAmount.amount}
                decimalScale={5}
              />
            )}
            subtitle={(
              <div className={classes.subtitle}>
                <Typography variant="subtitle2" className={classes.pre}>
                  <NumberFormat
                    value={availableAmount.amount.toFixed(6)}
                    decimalScale={5}
                    fixedDecimalScale
                    thousandSeparator=","
                    displayType="text"
                    prefix={availableAmount.prefix}
                    suffix={availableAmount.suffix}
                  />
              &nbsp;
                  {t('send.available')}
                </Typography>
                <Button
                  variant="primaryOutlined"
                  value={t('common.max')}
                  onClick={() => handleChangeAmount(Number(availableAmount.amount.toFixed(6)))}
                />
              </div>
            )}
          />

          <Dialog
            title={t('send.selectAsset')}
            items={assets}
            onClose={handleCloseAssets}
            selectedValue={selectedAsset}
            open={openAssets}
          />

        </Grid>
        <Grid item xs={12}>
          <FormItem
            label={t('send.to')}
            component={(
              <IDInput
                loading={loadingAddress}
                value={address}
                onChange={handleChangeAddress}
                isValid={addressInfo.isValid && !isUserAddress}
              />
            )}
          />
        </Grid>
        {
          addressInfo.type === ADDRESS_TYPES.ACCOUNT && selectedAsset.id === 'CYCLES'
          && (
            <Grid item xs={12}>
              <div className={classes.appearAnimation}>
                <Alert
                  type="danger"
                  endIcon
                  title={t('send.accountWarning')}
                />
              </div>
            </Grid>
          )
        }
        {!!address && !addressInfo?.isValid && !loadingAddress && (
          <span className={classes.errorMessage}>
            {isICNSName(address) ? t('send.invalidICNS') : t('send.invalidAddress')}
          </span>
        )}
        {isUserAddress && <span className={classes.errorMessage}>{t('deposit.sameAddressFromTo')}</span>}
        <Grid item xs={12} style={{ paddingTop: '18px' }}>
          <Button
            variant="rainbow"
            value={t('common.continue')}
            fullWidth
            disabled={
              !(parseFloat(amount) > 0)
              || !addressInfo.isValid
              || loadingAddress
              || address === null
              || address === ''
              || isUserAddress
            }
            onClick={handleChangeStep}
            loading={loadingAddress}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step1;

Step1.propTypes = {
  amount: PropTypes.string.isRequired,
  handleChangeAmount: PropTypes.func.isRequired,
  handleChangeStep: PropTypes.func.isRequired,
  selectedAsset: PropTypes.objectOf(PropTypes.string).isRequired,
  availableAmount: PropTypes.objectOf(PropTypes.string).isRequired,
  primaryValue: PropTypes.objectOf(PropTypes.string).isRequired,
  secondaryValue: PropTypes.objectOf(PropTypes.string).isRequired,
  conversionPrice: PropTypes.number.isRequired,
  handleSwapValues: PropTypes.func.isRequired,
  handleChangeAsset: PropTypes.func.isRequired,
  assets: PropTypes.arrayOf(PropTypes.string).isRequired,
  address: PropTypes.objectOf(PropTypes.string).isRequired,
  handleChangeAddress: PropTypes.func.isRequired,
  addressInfo: PropTypes.objectOf(PropTypes.string).isRequired,
  loadingAddress: PropTypes.bool.isRequired,
};
