import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import {
  Alert, Button, FormItem, TextInput,
} from '@ui';
import useStyles from '../styles';

const CreatePasswordStep = ({ handleNextStep, handleSetMnemonic, mnemonic }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleCreateAccount = async () => {
    const keyRing = new PlugController.PlugKeyRing();

    if (mnemonic) { // if receive mnemonic, import account
      await keyRing.importMnemonic({ mnemonic, password });
    } else { // else create account
      const account = await keyRing.create({ password });
      handleSetMnemonic(account.mnemonic);
    }

    handleNextStep();
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
      <Grid item xs={12} className={classes.marginBottom}>
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
      <Grid item xs={12} className={classes.marginBottom}>
        <Button
          variant="rainbow"
          value={t('welcome.passwordButton')}
          onClick={handleCreateAccount}
          fullWidth
          disabled={
            password === ''
            || password !== confirmPassword
            || password.length < 12
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Alert type="warning" title={t('welcome.passwordWarning')} startIcon />
      </Grid>
    </>
  );
};

export default CreatePasswordStep;

CreatePasswordStep.defaultProps = {
  handleSetMnemonic: null,
  mnemonic: null,
};

CreatePasswordStep.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  handleSetMnemonic: PropTypes.func,
  mnemonic: PropTypes.arrayOf(PropTypes.string),
};
