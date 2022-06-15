import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { IDInput } from '@components';
import {
  FormItem, MultiInput, Container, Button, Dialog, Alert,
} from '@ui';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { ADDRESS_TYPES } from '@shared/constants/addresses';
import { isICNSName } from '@shared/utils/ids';
import { getAssetFee } from '@shared/constants/addresses';
import { setSendTokenAmount, setSendTokenAddress } from '@redux/send';
import { MAX_DECIMALS, DISPLAY_DECIMALS } from '@shared/constants/send';
import { truncateFloatForDisplay } from '@shared/utils/send';

import useStyles from '../../styles';
import { CyclesToAccountWarning } from './components';

const SelectAsset = ({
  assets,
  loadingAddress,

  handleChangeStep,
  handleSwapValues,
  handleChangeAsset,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const {
    amount: rawAmount,
    address,
    addressInfo,
    selectedAsset,
    primaryValue,
    secondaryValue,
  } = useSelector((state) => state.send);
  const amount = Number(rawAmount);
  const { principalId, accountId } = useSelector((state) => state.wallet);

  const isUserAddress = [principalId, accountId].includes(address);
  const conversionPrice = amount / secondaryValue.price;

  const [openAssets, setOpenAssets] = useState(false);

  const handleCloseAssets = (value) => {
    setOpenAssets(false);
    handleChangeAsset(value);
  };

  const fee = getAssetFee(selectedAsset);
  const available = truncateFloatForDisplay(
    (selectedAsset?.amount || 0 - fee),
    MAX_DECIMALS,
    DISPLAY_DECIMALS
  );
  const convertedAmount = Math.max(available * primaryValue.conversionRate, 0);
  const [availableAmount, setAvailableAmount] = useState({
    amount: convertedAmount,
    prefix: primaryValue.prefix,
    suffix: primaryValue.suffix,
  });

  const isContinueDisabled = !(parseFloat(amount) > 0)
    || !addressInfo.isValid
    || loadingAddress
    || address === null
    || address === ''
    || isUserAddress;

  const handleChangeAmount = (newAmount) => {
    dispatch(setSendTokenAmount(newAmount));
  };

  const handleChangeAddress = (newAddress) => {
    dispatch(setSendTokenAddress(newAddress));
  };

  useEffect(() => {
    const convertedAmount = Math.max(available * primaryValue.conversionRate, 0);

    setAvailableAmount({
      amount: convertedAmount,
      prefix: primaryValue.prefix,
      suffix: primaryValue.suffix,
    });
  }, [primaryValue]);

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
            <CyclesToAccountWarning />
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
            disabled={isContinueDisabled}
            onClick={handleChangeStep}
            loading={loadingAddress}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SelectAsset;

SelectAsset.propTypes = {
  handleChangeStep: PropTypes.func.isRequired,
  handleSwapValues: PropTypes.func.isRequired,
  handleChangeAsset: PropTypes.func.isRequired,
  assets: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadingAddress: PropTypes.bool.isRequired,
};
