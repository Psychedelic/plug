import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {
  Button, Container, USDFormat, AssetFormat,

} from '@ui';
import useStyles from '../styles';

const amount = 152.28;
const value = 12183.29;

const Step2 = ({ selectedToken, handleClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">{t('addToken.confirmText')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.confirmToken}>
            <img src={selectedToken.image} />
            <div className={classes.leftContainer}>
              <Typography variant="h4">{selectedToken.name}</Typography>
              <Typography variant="subtitle1"><AssetFormat value={amount} asset={selectedToken.token} /></Typography>
            </div>
            <div className={classes.rightContainer}>
              <Typography variant="h4"><USDFormat value={value} /></Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="rainbow"
            value={t('common.add')}
            onClick={handleClose}
            fullWidth
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step2;

Step2.propTypes = {
  selectedToken: PropTypes.objectOf(PropTypes.object).isRequired,
  handleClose: PropTypes.func.isRequired,
};
