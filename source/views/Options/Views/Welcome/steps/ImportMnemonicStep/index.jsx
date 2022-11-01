import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import * as bip39 from 'bip39';

import { HANDLER_TYPES, sendMessage } from '@background/Keyring';
import { clearStorage } from '@modules/storageManager';
import { getRandomEmoji } from '@shared/constants/emojis';
import { Button, FormInput } from '@components';
import useStyles from './styles';
import ShowHideToggle from '../../components/ShowHideToggle';
import TextInput from '../../../../../../components/TextInput';

const MNEMONIC_LENGTH = 12;

export function clearClipboard() {
  window.navigator.clipboard.writeText('');
}

const isValidMnemonic = (mnemonic) => bip39.validateMnemonic(mnemonic);
export const parseMnemonic = (mnemonic) => (mnemonic || '').trim().toLowerCase().match(/\w+/gu)?.join(' ') || '';

const createArray = (length, fillValue) => new Array(length).fill(fillValue);

const ImportWalletStep = ({ handleNextStep, handleSetMnemonic }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [mnemonicError, setMnemonicError] = useState('');
  const [pasteFailed, setPasteFailed] = useState(false);
  const [draftMnemonic, setDraftMnemonic] = useState(createArray(MNEMONIC_LENGTH, ''));
  const [showMnemonic, setShowMnemonic] = useState(createArray(MNEMONIC_LENGTH, false));
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [invalidMnemonic, setInvalidMnemonic] = useState(false);

  const handleCreateAccount = async () => {
    // clean the storage before initiating keyring
    clearStorage();
    const params = { password, mnemonic: draftMnemonic.join(' '), icon: getRandomEmoji() };
    sendMessage({ type: HANDLER_TYPES.IMPORT, params }, (response) => {
      handleSetMnemonic(response?.mnemonic);
    });
    handleNextStep();
  };

  const onMnemonicChange = useCallback(
    (newDraftMnemonic) => {
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

      setDraftMnemonic(newDraftMnemonic);
      setMnemonicError(newMnemonicError);
    },
    [setDraftMnemonic, setMnemonicError, t],
  );

  const toggleShowMnemonic = useCallback((index) => {
    setShowMnemonic((currentShowMnemonic) => {
      const newShowMnemonic = currentShowMnemonic.slice();
      if (newShowMnemonic[index]) {
        newShowMnemonic[index] = false;
      } else {
        newShowMnemonic.fill(false);
        newShowMnemonic[index] = true;
      }
      return newShowMnemonic;
    });
  }, []);

  const onMnemonicWordChange = useCallback(
    (index, newWord) => {
      setPasteFailed(false);
      const newMnemonic = draftMnemonic.slice();
      newMnemonic[index] = newWord.trim();
      onMnemonicChange(newMnemonic);
    },
    [draftMnemonic, onMnemonicChange],
  );

  const onMnemonicPaste = useCallback(
    (rawMnemonic) => {
      const parsedMnemonic = parseMnemonic(rawMnemonic);
      let newDraftMnemonic = parsedMnemonic.split(' ');
      if (newDraftMnemonic.length > MNEMONIC_LENGTH) {
        setPasteFailed(true);
        return;
      }
      setPasteFailed(false);

      // If paste content is shorter than 12 words, fill the rest with empty strings
      if (newDraftMnemonic.length < MNEMONIC_LENGTH) {
        newDraftMnemonic = newDraftMnemonic.concat(
          createArray(MNEMONIC_LENGTH - newDraftMnemonic.length, ''),
        );
      }
      setShowMnemonic(createArray(MNEMONIC_LENGTH, false));
      onMnemonicChange(newDraftMnemonic);
      clearClipboard();
    },
    [onMnemonicChange, pasteFailed, setPasteFailed],
  );

  const onPasswordChange = useCallback(
    (event) => {
      const newPassword = event.target.value;
      let newConfirmPasswordError = '';
      let newPasswordError = '';

      if (newPassword && newPassword.length < 8) {
        newPasswordError = t('passwordNotLongEnough');
      }

      if (confirmPassword && newPassword !== confirmPassword) {
        newConfirmPasswordError = t('passwordsDontMatch');
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
        newConfirmPasswordError = t('passwordsDontMatch');
      }

      setConfirmPassword(newConfirmPassword);
      setConfirmPasswordError(newConfirmPasswordError);
    },
    [password, t],
  );

  return (
    <div className={classes.mnemonicContainer}>
      <div className={classes.mnemonicWordsContainer}>
        {[...Array(MNEMONIC_LENGTH).keys()].map((index) => {
          const id = `mnemonic-word-${index}`;
          return (
            <div key={index} className={classes.mnemonicWordInputContainer}>
              <Typography className={classes.mnemonicWordLabel}>{`${index + 1}.`}</Typography>
              <TextInput
                id={id}
                className={classes.mnemonicWordInput}
                data-testid={`seedphrase-input-${index + 1}`}
                type={showMnemonic[index] ? 'text' : 'password'}
                onChange={(e) => {
                  e.preventDefault();
                  onMnemonicWordChange(index, e.target.value);
                }}
                value={draftMnemonic[index]}
                autoComplete="off"
                onPaste={(event) => {
                  const newMnemonic = event.clipboardData.getData('text');
                  if (newMnemonic.trim().match(/\s/u)) {
                    event.preventDefault();
                    onMnemonicPaste(newMnemonic);
                  }
                }}
              />
              <ShowHideToggle
                name={`${id}-checkbox`}
                show={showMnemonic[index]}
                onChange={() => toggleShowMnemonic(index)}
                label={t('MnemonicToggleShow')}
              />
            </div>
          );
        })}
      </div>
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
            autoFocus
            data-testid="enter-password-input"
          />
          <FormInput
            containerClassName={classes.passwordInput}
            label={t('welcome.passwordConfirmLabel')}
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            type="password"
            id="password"
            error={confirmPasswordError}
            autoFocus
            data-testid="enter-password-input"
          />
        </div>
        <Button
          variant="rainbow"
          value={t('welcome.importButton')}
          onClick={handleCreateAccount}
          fullWidth
          disabled={invalidMnemonic}
          data-testid="confirm-seedphrase-button"
        />
      </div>
    </div>
  );
};

export default ImportWalletStep;

ImportWalletStep.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  handleSetMnemonic: PropTypes.func.isRequired,
};
