import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {
  Button, Container, USDFormat, AssetFormat,
  TokenIcon,
} from '@components';

import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import {
  setCollections,
  setCollectionsLoading,
} from '@redux/wallet';
import { useDispatch, useSelector } from 'react-redux';

import useStyles from '../styles';


const Step2 = ({ selectedToken, handleClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const { collectionsLoading } = useSelector((state) => state.nfts);

  const registerToken = () => {
    dispatch(registerNFT(selectedToken));
    handleClose();
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">{t('addNFT.confirmText')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.confirmToken}>
            <TokenIcon
              logo={selectedToken.logo}
              className={classes.tokenImage}
            />
            <div className={classes.leftContainer}>
              <Typography variant="h4">{selectedToken.name}</Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('common.add')}
            onClick={registerToken}
            loading={collectionsLoading}
            disabled={loading}
            fullWidth
            data-testid="add-button"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step2;

Step2.propTypes = {
  selectedToken: PropTypes.objectOf(PropTypes.string).isRequired,
  handleClose: PropTypes.func.isRequired,
};
