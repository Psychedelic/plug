import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container, FormInput, Button, Checkbox,
} from '@ui';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';

const Step2 = ({ handleChangeStep }) => {
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const handleChangeCheckbox = (event) => { setChecked(event.target.checked); };
  const handleChangePassword = (event) => { setPassword(event.target.value); };

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormInput id="password" label={t('common.password')} type="password" value={password} onChange={handleChangePassword} />
        </Grid>
        <Grid item xs={12}>
          <Checkbox checked={checked} handleChange={handleChangeCheckbox} label={t('seedPhrase.checkbox')} />
        </Grid>
        <Grid item xs={12}>
          <Button value="Continue" onClick={handleChangeStep} variant="rainbow" fullWidth disabled={password === '' || !checked} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step2;

Step2.propTypes = {
  handleChangeStep: PropTypes.func.isRequired,
};
