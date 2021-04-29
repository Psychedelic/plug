import React, { useState } from 'react';
import {
  Container, FormInput, Button,
} from '@ui';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';

const Step3 = () => {
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const { navigator } = useRouter();

  const handleChangePassword = (event) => { setPassword(event.target.value); };

  return (
    <Container>
      <FormInput id="password" label={t('common.password')} type="password" value={password} onChange={handleChangePassword} />
      <Button value={t('swap.title')} onClick={() => navigator.navigate('home')} variant="rainbow" fullWidth disabled={password === ''} />
    </Container>
  );
};

export default Step3;
