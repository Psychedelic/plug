import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { IDInput } from '@components';
import {
  Container, FormItem, Select, Button,
} from '@ui';
import { Grid } from '@material-ui/core';

import { validatePrincipalId } from '@shared/utils/ids';
import { setSendAddress } from '@redux/nfts';
import { useICNS } from '@hooks';
import { ADDRESS_TYPES } from '@shared/constants/addresses';

import useStyles from './styles';
import { fallbackPunksUrl } from '../../utils';

const InputStep = ({ advanceStep }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [address, setAddress] = useState(null);
  const { resolvedAddress, isValid: isValidICNS, loading } = useICNS(address, false, 500);

  const { selectedNft: nft } = useSelector((state) => state.nfts);
  const { collections } = useSelector((state) => state.wallet);

  const collection = useMemo(() => collections?.find(
    (col) => col.name === nft?.collection,
  ) || {},
  [collections, nft]);

  const handleAddressChange = (val) => setAddress(val);
  const handleAdvanceStep = () => {
    dispatch(setSendAddress({
      address: {
        address,
        type: isValidICNS ? ADDRESS_TYPES.ICNS : ADDRESS_TYPES.PRINCIPAL,
      },
      resolvedAddress: isValidICNS ? {
        address: resolvedAddress,
        type: ADDRESS_TYPES.PRINCIPAL,
      } : null,
    }));
    advanceStep();
  };
  const isValid = address === null || validatePrincipalId(address) || isValidICNS;
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            label={t('nfts.nft')}
            component={(
              <Select
                image={fallbackPunksUrl(nft?.url)}
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
                loading={loading}
                value={address}
                onChange={handleAddressChange}
                isValid={isValid}
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
                || address === ''
                || !isValid
              }
            onClick={handleAdvanceStep}
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
