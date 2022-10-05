import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import extension from 'extensionizer';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import {
  Plug, LinkButton, Button, FormInput,
} from '@components';
import { useRouter } from '@components/Router';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { setAccountInfo } from '@redux/wallet';
import { getContacts } from '@redux/contacts';
import { isClockInSync } from '@shared/utils/time';
import { syncContactsToDab } from '@shared/utils/contacts';

import PropTypes from 'prop-types';
import useStyles from './styles';

const Login = ({ redirect }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
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
        // Upload contacts
        syncContactsToDab().then(dispatch(getContacts()));

        isClockInSync()
          .then((isInRange) => {
            if (!isInRange) {
              navigator.navigate('clockError');
            }
          });
        sendMessage({
          type: HANDLER_TYPES.GET_STATE,
          params: { },
        }, (state) => {
          if (Object.keys(state?.wallets).length) {
            dispatch(setAccountInfo(state.wallets[state.currentWalletId]));
          }
        });
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
          autoFocus
          data-testid="enter-password-input"
        />
        <Button
          value={t('login.unlock')}
          variant="rainbow"
          fullWidth
          disabled={password === ''}
          onClick={handleLogin}
          data-testid="unlock-wallet-button"
        />
      </div>

      <div className={clsx(classes.flex, classes.actionContainer)}>
        <Typography variant="subtitle1">{t('login.restore')}</Typography>
        <LinkButton
          style={{ paddingTop: 6 }}
          value={t('login.import')}
          onClick={() => extension.tabs.create({ url: 'options.html' })}
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
