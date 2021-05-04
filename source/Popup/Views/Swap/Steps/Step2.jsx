import React from 'react';
import { SwapInfo } from '@components';
import { Container, Button, InfoRow } from '@ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const calculateRate = (fromPrice, toPrice) => fromPrice / toPrice;

const calculateAmount = (amount, rate) => amount * rate;

const Step2 = ({
  fromAsset, fromAmount, toAsset, handleChangeStep,
}) => {
  const { t } = useTranslation();

  const rate = calculateRate(fromAsset.price, toAsset.price);
  const toAmount = calculateAmount(fromAmount, rate);

  return (
    <Container>
      <SwapInfo
        fromAsset={fromAsset}
        fromAmount={fromAmount}
        toAsset={toAsset}
        toAmount={toAmount}
      />

      <InfoRow name={t('common.rate')} value={`1 ${fromAsset.value} = ${rate} ${toAsset.value}`} />
      <InfoRow name={t('swap.swappingVia')} value={t('swap.cycleMinter')} />
      <InfoRow name={t('common.taxFee')} value="2.5 TC ($2.50)" />

      <Button
        variant="rainbow"
        value={t('swap.confirm')}
        onClick={handleChangeStep}
        style={{ marginTop: 24 }}
        fullWidth
      />
    </Container>
  );
};

export default Step2;

Step2.propTypes = {
  fromAsset: PropTypes.objectOf(PropTypes.object).isRequired,
  fromAmount: PropTypes.number.isRequired,
  toAsset: PropTypes.objectOf(PropTypes.object).isRequired,
  handleChangeStep: PropTypes.func.isRequired,
};
