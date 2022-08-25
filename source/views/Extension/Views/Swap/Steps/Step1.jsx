import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {
  FormItem, MultiInput, Container, Select, Button, Dialog,
} from '@components';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import ThinkingEmoji from '@assets/icons/thinking-emoji.svg';
import useStyles from '../styles';

const Step1 = ({
  amount,
  handleChangeAmount,
  handleChangeStep,
  // fromAssets,
  // toAssets,
  selectedFromAsset,
  selectedToAsset,
  availableAmount,
  primaryValue,
  secondaryValue,
  conversionPrice,
  handleSwapValues,
  // handleChangeFromAsset,
  // handleChangeToAsset,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [openFromAssets, setOpenFromAssets] = useState(false);
  const [openToAssets, setOpenToAssets] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const handleCloseFromAssets = (_value) => {
    setOpenFromAssets(false);
    // handleChangeFromAsset(value);
  };

  // eslint-disable-next-line no-unused-vars
  const handleCloseToAssets = (_value) => {
    setOpenToAssets(false);
    // handleChangeToAsset(value);
  };

  return (
    <Container>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <FormItem
            label={t('swap.swapFrom')}
            component={(
              <MultiInput
                name={selectedFromAsset.name}
                image={selectedFromAsset.image}
                onClick={() => setOpenFromAssets(true)}
                value={amount}
                onChange={handleChangeAmount}
                primaryValue={primaryValue}
                secondaryValue={secondaryValue}
                conversionPrice={conversionPrice}
                handleSwapValues={handleSwapValues}
                availableAmount={availableAmount?.amount}
              />
            )}
            subtitle={(
              <div className={classes.subtitle}>
                <Typography variant="subtitle2">
                  <NumberFormat
                    value={availableAmount?.amount}
                    decimalScale={2}
                    fixedDecimalScale
                    thousandSeparator=","
                    displayType="text"
                    prefix={availableAmount.prefix}
                    suffix={availableAmount.suffix}
                  />
              &nbsp;
                  {t('swap.available')}
                </Typography>
                <Button
                  variant="primaryOutlined"
                  value={t('common.max')}
                  onClick={() => handleChangeAmount(availableAmount?.amount)}
                />
              </div>
            )}
          />
          <Dialog
            title={t('swap.swapFrom')}
            items={[]}
            onClose={handleCloseFromAssets}
            selectedValue={selectedFromAsset}
            open={openFromAssets}
            component={<SwapsComingSoon />}
          />
        </Grid>

        <Grid item xs={12}>
          <FormItem
            label={t('swap.swapTo')}
            component={(
              <Select
                image={selectedToAsset.image}
                name={selectedToAsset.name}
                shadow
                onClick={() => setOpenToAssets(true)}
              />
            )}
          />
          <Dialog
            title={t('swap.swapTo')}
            items={[]}
            onClose={handleCloseToAssets}
            selectedValue={selectedToAsset}
            open={openToAssets}
            component={<SwapsComingSoon />}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('swap.review')}
            fullWidth
            disabled={!(amount > 0)}
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
  selectedFromAsset: PropTypes.objectOf(PropTypes.string).isRequired,
  selectedToAsset: PropTypes.objectOf(PropTypes.string).isRequired,
  availableAmount: PropTypes.objectOf(PropTypes.string).isRequired,
  primaryValue: PropTypes.objectOf(PropTypes.string).isRequired,
  secondaryValue: PropTypes.objectOf(PropTypes.string).isRequired,
  conversionPrice: PropTypes.number.isRequired,
  handleSwapValues: PropTypes.func.isRequired,
};

const SwapsComingSoon = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.comingSoon}>
      <img src={ThinkingEmoji} />
      <Typography variant="h4">{t('swap.comingSoonTitle')}</Typography>
      <Typography variant="subtitle1">{t('swap.comingSoonSubtitle')}</Typography>
    </div>
  );
};
