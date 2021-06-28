import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { Plug } from '@components';
import { LinkButton, Button, FormInput } from '@ui';
import clsx from 'clsx';
import { KeyRing } from '@background';
import { useRouter } from '@components/Router';
import browser from 'webextension-polyfill';
import useStyles from './styles';

const Login = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { navigator } = useRouter();

  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setError(false);
  };

  const handleLogin = async () => {
    let unlocked;

    try {
      unlocked = await KeyRing.unlock(password);
    } catch (e) {
      unlocked = false;
    }

    if (unlocked) {
      navigator.navigate('home');
    } else {
      setError(true);
    }
  };

  return (
    <div className={classes.root}>

      <div className={clsx(classes.flex, classes.textContainer)}>
        <Plug size="big" />
        <Typography variant="h1" className={classes.title}>{t('login.title')}</Typography>
        <Typography variant="subtitle1">{t('login.subtitle')}</Typography>
      </div>

      <div className={clsx(classes.flex, classes.formContainer)}>
        <FormInput
          label={t('common.password')}
          value={password}
          onChange={handleChangePassword}
          type="password"
          id="password"
          error={error}
        />
        <Button
          value={t('login.unlock')}
          variant="rainbow"
          fullWidth
          disabled={password === ''}
          onClick={handleLogin}
        />
      </div>

      <div className={clsx(classes.flex, classes.actionContainer)}>
        <Typography variant="subtitle1">{t('login.restore')}</Typography>
        <LinkButton
          value={t('login.import')}
          onClick={() => browser.tabs.create({ url: 'options.html' })}
        />
      </div>

    </div>
  );
};

export default Login;
