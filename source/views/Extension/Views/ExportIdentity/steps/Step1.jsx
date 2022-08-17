import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container, FormInput, Button, Checkbox,
} from '@components';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';

const Step1 = ({ handleChangeStep }) => {
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const { t } = useTranslation();

  const handleChangeCheckbox = (event) => { setChecked(event.target.checked); };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setError(false);
  };

  const handleLogin = () => {
    sendMessage({
      type: HANDLER_TYPES.UNLOCK,
      params: { password, redirect: false },
    }, (unlocked) => (unlocked ? handleChangeStep() : setError(true)));
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormInput
            id="password"
            error={error}
            label={t('common.password')}
            type="password"
            value={password}
            onChange={handleChangePassword}
            data-testid="password-input"
          />
        </Grid>
        <Grid item xs={12}>
          <Checkbox checked={checked} handleChange={handleChangeCheckbox} label={t('exportIdentity.checkbox')} data-testid="safe-checkbox" />
        </Grid>
        <Grid item xs={12}>
          <Button
            value="Continue"
            onClick={handleLogin}
            variant="rainbow"
            data-testid="continue-button"
            fullWidth
            disabled={
              password === ''
              || !checked
              || error
            }
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Step1;

Step1.propTypes = {
  handleChangeStep: PropTypes.func.isRequired,
};
