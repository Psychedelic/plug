import React from 'react';
import {
  SwapInfo, Container, Button, InfoRow,
} from '@components';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useRouter } from '@components/Router';

const calculateRate = (fromPrice, toPrice) => fromPrice / toPrice;

const calculateAmount = (amount, rate) => amount * rate;

const Step2 = ({
  fromAsset, fromAmount, toAsset,
}) => {
  const { t } = useTranslation();
  const { navigator } = useRouter();

  const rate = calculateRate(fromAsset.price, toAsset.price);
  const toAmount = calculateAmount(fromAmount, rate);

  return (
    <Container>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <SwapInfo
            fromAsset={fromAsset}
            fromAmount={fromAmount}
            toAsset={toAsset}
            toAmount={toAmount}
          />
        </Grid>

        <Grid item xs={12}>
          <InfoRow name={t('common.rate')} value={`1 ${fromAsset.value} = ${rate} ${toAsset.value}`} />
          <InfoRow name={t('swap.swappingVia')} value={t('swap.cycleMinter')} />
          <InfoRow name={t('common.taxFee')} value="2.5 TC ($2.50)" />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('swap.title')}
            onClick={() => navigator.navigate('home')}
            fullWidth
          />
        </Grid>
      </Grid>

    </Container>
  );
};

export default Step2;

Step2.propTypes = {
  fromAsset: PropTypes.objectOf(PropTypes.string).isRequired,
  fromAmount: PropTypes.number.isRequired,
  toAsset: PropTypes.objectOf(PropTypes.string).isRequired,
};
