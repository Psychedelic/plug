import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { IDInput } from '@components';
import {
  Container, FormItem, Select, Button,
} from '@ui';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { validatePrincipalId } from '@shared/utils/ids';

const useStyles = makeStyles(() => ({
  appearAnimation: {
    animationName: '$appear',
    animationDuration: '0.5s',
  },
  nftImage: {
    height: 42,
    width: 42,
    borderRadius: 5,
  },
}));

const InputStep = ({ advanceStep }) => {
  const { t } = useTranslation();
  const [address, setAddress] = useState(null);

  const { selectedNft: nft } = useSelector((state) => state.nfts);
  const { collections } = useSelector((state) => state.wallet);
  const classes = useStyles();

  const collection = useMemo(() => collections?.find(
    (col) => col.name === nft?.collection,
  ) || {},
  [collections, nft]);

  const fallbackNftUrl = (url) => (url?.includes?.('https') ? url : `https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app${url}`);
  const handleAddressChange = (val) => setAddress(val);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            label={t('nfts.nft')}
            component={(
              <Select
                image={fallbackNftUrl(nft?.url)}
                name={nft?.name || `${collection?.name ?? ''} #${nft?.index}`}
                text={`#${nft?.index}`}
                imageClassName={classes.nftImage}
                nft
                readonly
                shadow
              />
              )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormItem
            label={t('nfts.sendTo')}
            component={(
              <IDInput
                value={address}
                onChange={handleAddressChange}
                isValid={address === null || validatePrincipalId(address)}
                placeholder={t('nfts.inputPrincipalId')}
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
                address === null
                || !validatePrincipalId(address)
                || address === ''
              }
            onClick={advanceStep}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

InputStep.propTypes = {
  advanceStep: PropTypes.func.isRequired,
};

export default InputStep;
