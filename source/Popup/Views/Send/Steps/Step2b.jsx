import React, { useState } from 'react';
import {
  Container, Button, Checkbox,
} from '@components';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SirenImg from '@assets/icons/siren.svg';

const Step2b = ({ handleChangeStep }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  const handleChangeCheckbox = (event) => { setChecked(event.target.checked); };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <img src={SirenImg} />
        </Grid>
        <Grid item xs={12} style={{ fontSize: 16 }}>
          <span style={{ color: '#6B7280' }}>{t('send.canisterDetectedIcp1')}</span>
          <span style={{ color: 'rgb(220, 38, 38)' }}>{t('send.canisterDetectedIcp2')}</span>
        </Grid>
        <Grid item xs={12}>
          <Checkbox checked={checked} handleChange={handleChangeCheckbox} label={t('send.canisterDetectedUnderstand')} />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="rainbow" value={t('common.continue')} onClick={handleChangeStep} disabled={!checked} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step2b;

Step2b.propTypes = {
  handleChangeStep: PropTypes.func.isRequired,
};
