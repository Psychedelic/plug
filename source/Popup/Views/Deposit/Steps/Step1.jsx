import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import {
  FormItem, Select, Dialog, Container, Button,
} from '@ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { currencyPropTypes } from '@shared/constants/currencies';
import { sourcePropTypes } from '@shared/constants/sources';

const Step1 = ({
  assets,
  selectedAsset,
  setSelectedAsset,
  sources,
  selectedSource,
  setSelectedSource,
  handleChangeStep,
}) => {
  const { t } = useTranslation();

  const [openAssets, setOpenAssets] = useState(false);
  const [openSources, setOpenSources] = useState(false);

  const handleCloseAssets = (value) => {
    setOpenAssets(false);
    setSelectedAsset(value);
  };

  const handleCloseSources = (value) => {
    setOpenSources(false);
    setSelectedSource(value);
  };
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            label={t('deposit.asset')}
            component={(
              <Select
                image={selectedAsset.image}
                name={selectedAsset.name}
                onClick={() => setOpenAssets(true)}
                shadow
              />
            )}
          />
          <Dialog
            title={t('deposit.selectAsset')}
            items={Array.from(assets.values())}
            onClose={handleCloseAssets}
            selectedValue={selectedAsset}
            open={openAssets}
          />
        </Grid>
        {
          selectedAsset.id === 'CYCLES'
          && (
            <Grid item xs={12}><FormItem
              label={t('deposit.depositingFrom')}
              component={(
                <Select
                  image={selectedSource.image}
                  name={selectedSource.name}
                  onClick={() => setOpenSources(true)}
                />
              )}
            />
              <Dialog
                title={t('deposit.selectSource')}
                items={Array.from(sources.values())}
                onClose={handleCloseSources}
                selectedValue={selectedSource}
                open={openSources}
              />
            </Grid>
          )
        }
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('common.continue')}
            onClick={handleChangeStep}
            fullWidth
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step1;

Step1.propTypes = {
  assets: PropTypes.objectOf(PropTypes.object).isRequired,
  selectedAsset: PropTypes.shape(currencyPropTypes).isRequired,
  setSelectedAsset: PropTypes.func.isRequired,
  sources: PropTypes.objectOf(PropTypes.object).isRequired,
  selectedSource: PropTypes.shape(sourcePropTypes).isRequired,
  setSelectedSource: PropTypes.func.isRequired,
  handleChangeStep: PropTypes.func.isRequired,
};
