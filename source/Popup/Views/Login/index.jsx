import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { Plug } from '@components';
import { LinkButton, Button, FormInput } from '@ui';
import clsx from 'clsx';
import useStyles from './styles';

const Login = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [disableButton, setDisableButton] = useState(true);

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    setDisableButton(password === '');
  }, [password]);

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
        />
        <Button
          value={t('login.unlock')}
          variant="rainbow"
          fullWidth
          disabled={disableButton}
        />
      </div>

      <div className={clsx(classes.flex, classes.actionContainer)}>
        <Typography variant="subtitle1">{t('login.restore')}</Typography>
        <LinkButton value={t('login.import')} onClick={() => null} />
      </div>

    </div>
  );
};

export default Login;
