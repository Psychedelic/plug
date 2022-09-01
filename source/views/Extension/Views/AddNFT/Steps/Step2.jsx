import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import XTCIcon from '@assets/icons/XTC.svg';
import {
  Button, Container, USDFormat, AssetFormat,
  TokenIcon,
} from '@components';
import { USD_PER_TC, CYCLES_PER_TC } from '@shared/constants/currencies';
import { useICPPrice } from '@redux/icp';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { setAssets, setAssetsLoading } from '@redux/wallet';
import { useDispatch } from 'react-redux';

import useStyles from '../styles';


const Step2 = ({ selectedToken, handleClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // const displayToken = parseTokenBySymbol(selectedToken); // podemos agregar un parser para terminar con el ultimo objeto
  const icpPrice = useICPPrice();

  const registerToken = () => {
    setLoading(true);
    console.log('el selected token es ->', selectedToken);
    sendMessage({
      type: HANDLER_TYPES.ADD_CUSTOM_NFT,
      params: selectedToken,
    });
    console.log('salio todo correcto')
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
            loading={loading}
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
