import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TextField, Typography } from '@material-ui/core';
import * as bip39 from 'bip39';

import { Button } from '@components';
import useStyles from './styles';

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

  const [text, setText] = useState('');
  const [invalidMnemonic, setInvalidMnemonic] = useState(false);

  const handleImportMnemonic = () => {
    const trimmedText = text.trim();

    const isValid = bip39.validateMnemonic(trimmedText);
    if (isValid) {
      handleSetMnemonic(trimmedText);
      handleNextStep();
    } else {
      setInvalidMnemonic(true);
    }
  };

  const onMnemonicChange = useCallback(
    (newDraftMnemonic) => {
      let newMnemonicError = '';
      const joinedDraftMnemonic = newDraftMnemonic.join(' ').trim().toLowerCase();
      if (newDraftMnemonic.some((word) => word !== '')) {
        if (newDraftMnemonic.some((word) => word === '')) {
          newMnemonicError = t('seedPhraseReq');
        } else if (!isValidMnemonic(joinedDraftMnemonic)) {
          newMnemonicError = t('invalidSeedPhrase');
        }
      }

      setDraftMnemonic(newDraftMnemonic);
      setMnemonicError(newMnemonicError);
      setText(newMnemonicError ? '' : joinedDraftMnemonic);
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

  return (
    <div className={classes.mnemonicContainer}>
      {[...Array(MNEMONIC_LENGTH).keys()].map((index) => {
        const id = `mnemonic-word-${index}`;
        return (
          <div key={index} className={classes.mnemonicWordInput}>
            <label htmlFor={id} className={classes.mnemonicWordLabel}>
              <Typography>{`${index + 1}.`}</Typography>
            </label>
            <TextField
              id={id}
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
            {/* <ShowHideToggle
              id={`${id}-checkbox`}
              ariaLabelHidden={t('MnemonicWordHidden')}
              ariaLabelShown={t('MnemonicWordShown')}
              shown={showMnemonic[index]}
              data-testid={`${id}-checkbox`}
              onChange={() => toggleShowMnemonic(index)}
              title={t('MnemonicToggleShow')}
            /> */}
          </div>
        );
      })}
      <Button
        variant="rainbow"
        value={t('welcome.importButton')}
        onClick={handleImportMnemonic}
        fullWidth
        disabled={invalidMnemonic}
        data-testid="confirm-seedphrase-button"
      />
    </div>
  );
};

export default ImportWalletStep;

ImportWalletStep.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  handleSetMnemonic: PropTypes.func.isRequired,
};
