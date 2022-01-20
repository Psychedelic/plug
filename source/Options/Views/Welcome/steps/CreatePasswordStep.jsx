import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import {
  Alert, Button, FormItem, TextInput,
} from '@ui';
import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import facepalmEmoji from '@assets/icons/facepalm.svg';
import { getRandomEmoji } from '@shared/constants/emojis';
import { clearStorage } from '@modules/storageManager';
import useStyles from '../styles';

const CreatePasswordStep = ({ handleNextStep, handleSetMnemonic, mnemonic }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validatePasswordError = () => {
    if (password.trim() === '' || password.length < 12) {
      return 'welcome.passwordShortError';
    }

    if (password !== confirmPassword) {
      return 'welcome.passwordMatchError';
    }

    return false;
  };

  const handleCreateAccount = async () => {
    const passwordValidation = validatePasswordError();
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    // clean the storage before initiating keyring
    clearStorage();

    const type = mnemonic ? HANDLER_TYPES.IMPORT : HANDLER_TYPES.CREATE;
    const params = { password, mnemonic, icon: getRandomEmoji() };

    sendMessage({ type, params }, (response) => {
      handleSetMnemonic(response?.mnemonic);
    });
    handleNextStep();
  };

  const handleKeyPress = (e) => e.key === 'Enter' && handleCreateAccount();

  return (
    <>
      <Grid item xs={12} onKeyPress={handleKeyPress}>
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
      <Grid item xs={12} className={classes.marginBottom} onKeyPress={handleKeyPress}>
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
        />
      </Grid>
      <Grid item xs={12}>
        <Alert type="warning" title={t('welcome.passwordWarning')} startIcon />
      </Grid>
      {passwordError && (
        <Grid item xs={12} className={classes.passwordError}>
          <img alt="facepalm-emoji" src={facepalmEmoji} />
          <p>{t(`${passwordError}`)}</p>
        </Grid>
      )}
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
