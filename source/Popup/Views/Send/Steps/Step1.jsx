import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { IDInput } from '@components';
import {
  FormItem, MultiInput, Container, Button, Dialog,
} from '@ui';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import NumberFormat from 'react-number-format';
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
  handleChangeAddressInfo,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [openAssets, setOpenAssets] = useState(false);

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
                name={selectedAsset.name}
                image={selectedAsset.image}
                onClick={() => setOpenAssets(true)}
                value={amount}
                onChange={handleChangeAmount}
                primaryValue={primaryValue}
                secondaryValue={secondaryValue}
                conversionPrice={conversionPrice}
                handleSwapValues={handleSwapValues}
                availableAmount={availableAmount.amount}
              />
            )}
            subtitle={(
              <div className={classes.subtitle}>
                <Typography variant="subtitle2">
                  <NumberFormat
                    value={availableAmount.amount}
                    decimalScale={2}
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
                  onClick={() => handleChangeAmount(availableAmount.amount)}
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
                value={address}
                onChange={handleChangeAddress}
                addressInfo={addressInfo}
                handleChangeAddressInfo={handleChangeAddressInfo}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('common.continue')}
            fullWidth
            disabled={
              !(amount > 0)
              || !addressInfo.isValid
              || address === null
              || address === ''
            }
            onClick={handleChangeStep}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step1;

Step1.propTypes = {
  amount: PropTypes.number.isRequired,
  handleChangeAmount: PropTypes.func.isRequired,
  handleChangeStep: PropTypes.func.isRequired,
  selectedAsset: PropTypes.objectOf(PropTypes.object).isRequired,
  availableAmount: PropTypes.objectOf(PropTypes.object).isRequired,
  primaryValue: PropTypes.objectOf(PropTypes.object).isRequired,
  secondaryValue: PropTypes.objectOf(PropTypes.object).isRequired,
  conversionPrice: PropTypes.number.isRequired,
  handleSwapValues: PropTypes.func.isRequired,
  handleChangeAsset: PropTypes.func.isRequired,
  assets: PropTypes.arrayOf(PropTypes.object).isRequired,
  address: PropTypes.objectOf(PropTypes.object).isRequired,
  handleChangeAddress: PropTypes.func.isRequired,
  addressInfo: PropTypes.objectOf(PropTypes.object).isRequired,
  handleChangeAddressInfo: PropTypes.func.isRequired,
};
