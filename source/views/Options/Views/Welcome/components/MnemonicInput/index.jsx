import { TextField, Typography } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as bip39 from 'bip39';
import useStyles from './styles';

const MNEMONIC_LENGTH = 12;

export function clearClipboard() {
  window.navigator.clipboard.writeText('');
}

const isValidMnemonic = (mnemonic) => bip39.validateMnemonic(mnemonic);
export const parseMnemonic = (mnemonic) => (mnemonic || '').trim().toLowerCase().match(/\w+/gu)?.join(' ') || '';

const createArray = (length, fillValue) => new Array(length).fill(fillValue);

const MnemonicInput = ({ onChange }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [mnemonicError, setMnemonicError] = useState('');
  const [pasteFailed, setPasteFailed] = useState(false);
  const [draftMnemonic, setDraftMnemonic] = useState(createArray(MNEMONIC_LENGTH, ''));
  const [showMnemonic, setShowMnemonic] = useState(createArray(MNEMONIC_LENGTH, false));
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
      onChange(newMnemonicError ? '' : joinedDraftMnemonic);
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

  return [...Array(MNEMONIC_LENGTH).keys()].map((index) => {
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
  });
};

export default MnemonicInput;
