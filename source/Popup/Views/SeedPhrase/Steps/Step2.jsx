import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container, FormInput, Button, Checkbox,
} from '@ui';
import { useTranslation } from 'react-i18next';

const Step2 = ({ handleChangeStep }) => {
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const handleChangeCheckbox = (event) => { setChecked(event.target.checked); };
  const handleChangePassword = (event) => { setPassword(event.target.value); };

  return (
    <Container>
      <FormInput id="password" label={t('common.password')} type="password" value={password} onChange={handleChangePassword} />
      <Checkbox checked={checked} handleChange={handleChangeCheckbox} label={t('seedPhrase.checkbox')} />
      <Button value="Continue" onClick={handleChangeStep} variant="rainbow" fullWidth disabled={password === '' || !checked} />
    </Container>
  );
};

export default Step2;

Step2.propTypes = {
  handleChangeStep: PropTypes.func.isRequired,
};
