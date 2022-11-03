import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as bip39 from 'bip39';

import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { clearStorage } from '@modules/storageManager';
import { getRandomEmoji } from '@shared/constants/emojis';
import { createArray } from '@shared/utils/array';
import { Alert, Button, FormInput } from '@components';
import facepalmEmoji from '@assets/icons/facepalm.svg';

import useStyles from './styles';
import MnemonicInput from '../../components/MnemonicInput';

const MNEMONIC_LENGTH = 12;

export function clearClipboard() {
  window.navigator.clipboard.writeText('');
}

const isValidMnemonic = (mnemonic) => bip39.validateMnemonic(mnemonic);

const ImportWalletStep = ({ handleNextStep, handleSetMnemonic }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [draftMnemonic, setDraftMnemonic] = useState(
    createArray(MNEMONIC_LENGTH, ''),
  );
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [invalidMnemonic, setInvalidMnemonic] = useState(true);

  const onMnemonicChange = (newDraftMnemonic) => {
    let newMnemonicError = '';
    const joinedDraftMnemonic = newDraftMnemonic.join(' ').trim().toLowerCase();
    if (newDraftMnemonic.some((word) => word !== '')) {
      if (newDraftMnemonic.some((word) => word === '')) {
        newMnemonicError = t('seedPhraseReq');
      } else if (!isValidMnemonic(joinedDraftMnemonic)) {
        setInvalidMnemonic(true);
        newMnemonicError = t('invalidSeedPhrase');
      }
    }
    setInvalidMnemonic(newMnemonicError?.length);
    setDraftMnemonic(newDraftMnemonic);
    handleSetMnemonic(newMnemonicError ? '' : newDraftMnemonic);
  };

  const handleCreateAccount = async () => {
    // clean the storage before initiating keyring
    clearStorage();
    const params = {
      password,
      mnemonic: draftMnemonic.join(' '),
      icon: getRandomEmoji(),
    };
    sendMessage({ type: HANDLER_TYPES.IMPORT, params }, (response) => {
      handleSetMnemonic(response?.mnemonic);
    });
    handleNextStep();
  };

  const onPasswordChange = useCallback(
    (event) => {
      const newPassword = event.target.value;
      let newConfirmPasswordError = '';
      let newPasswordError = '';

      if (newPassword && newPassword.length < 8) {
        newPasswordError = t('welcome.passwordShortError');
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        newConfirmPasswordError = t('welcome.passwordMatchError');
      }

      setPassword(newPassword);
      setPasswordError(newPasswordError);
      setConfirmPasswordError(newConfirmPasswordError);
    },
    [confirmPassword, t],
  );

  const onConfirmPasswordChange = useCallback(
    (event) => {
      const newConfirmPassword = event.target.value;
      let newConfirmPasswordError = '';

      if (password !== newConfirmPassword) {
        newConfirmPasswordError = t('welcome.passwordMatchError');
      }

      setConfirmPassword(newConfirmPassword);
      setConfirmPasswordError(newConfirmPasswordError);
    },
    [password, t],
  );
  const isDisabled = invalidMnemonic
    || !password
    || !confirmPassword
    || passwordError
    || confirmPasswordError;

  useEffect(() => setDraftMnemonic(createArray(MNEMONIC_LENGTH, '')), []);
  return (
    <div className={classes.mnemonicContainer}>
      <MnemonicInput onChange={onMnemonicChange} draftMnemonic={draftMnemonic} />
      <div className={classes.divider} />
      <div className={classes.footerContainer}>
        <div className={classes.passwordInputContainer}>
          <FormInput
            containerClassName={classes.passwordInput}
            label={t('welcome.passwordLabel')}
            value={password}
            onChange={onPasswordChange}
            type="password"
            id="password"
            error={passwordError}
            data-testid="enter-password-input"
          />
          <FormInput
            containerClassName={classes.passwordInput}
            label={t('welcome.passwordConfirmLabel')}
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            type="password"
            id="confirm-password"
            error={confirmPasswordError}
            data-testid="confirm-password-input"
          />
        </div>
        <Button
          variant="rainbow"
          value={t('welcome.importButton')}
          onClick={handleCreateAccount}
          fullWidth
          disabled={isDisabled}
          data-testid="confirm-seedphrase-button"
        />
        <Alert type="warning" title={t('welcome.passwordWarning')} className={classes.pwdAlert} startIcon />
        {(passwordError || confirmPasswordError) && (
          <div className={classes.passwordError}>
            <img alt="facepalm-emoji" src={facepalmEmoji} />
            <p data-testid="password-error">{passwordError || confirmPasswordError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportWalletStep;

ImportWalletStep.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  handleSetMnemonic: PropTypes.func.isRequired,
};
