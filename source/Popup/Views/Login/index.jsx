import React, { useState } from 'react';
import browser from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { Plug } from '@components';
import { LinkButton, Button, FormInput } from '@ui';
import { useRouter } from '@components/Router';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import PropTypes from 'prop-types';
import useStyles from './styles';

const Login = ({ redirect }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { navigator } = redirect ? {} : useRouter();

  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setError(false);
  };

  const handleLogin = () => {
    sendMessage({
      type: HANDLER_TYPES.UNLOCK,
      params: { password, redirect: true },
    }, (unlocked) => {
      if (unlocked) {
        if (redirect) {
          redirect();
        } else {
          navigator.navigate('home');
        }
      } else {
        setError(true);
      }
    });
  };

  const handleKeyPress = (e) => e.key === 'Enter' && handleLogin();

  return (
    <div className={classes.root} onKeyPress={handleKeyPress}>
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
          style={{ paddingTop: 6 }}
          value={t('login.import')}
          onClick={() => browser.tabs.create({ url: 'options.html' })}
        />
      </div>

    </div>
  );
};

export default Login;

Login.propTypes = {
  redirect: PropTypes.func,
};

Login.defaultProps = {
  redirect: null,
};
