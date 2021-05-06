import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import {
  Alert, Button, FormItem, TextInput,
} from '@ui';

const CreatePasswordStep = ({ handleNextStep }) => {
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <>
      <Grid item xs={12}>
        <FormItem
          label={t('welcome.passwordLabel')}
          component={(
            <TextInput
              fullWidth
              value={password}
              onChange={handleChangePassword}
              type="password"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <FormItem
          style={{ marginTop: -24 }}
          label={t('welcome.passwordConfirmLabel')}
          component={(
            <TextInput
              fullWidth
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
              type="password"
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="rainbow"
          value={t('welcome.passwordButton')}
          onClick={handleNextStep}
          fullWidth
          disabled={password === '' || password !== confirmPassword || password.length < 12}
        />
      </Grid>
      <Grid item xs={12}>
        <Alert type="warning" value={t('welcome.passwordWarning')} />
      </Grid>
    </>
  );
};

export default CreatePasswordStep;

CreatePasswordStep.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
};
