import { TextField, Typography } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as bip39 from 'bip39';

const MNEMONIC_LENGTH = 12;

export function clearClipboard() {
  window.navigator.clipboard.writeText('');
}

const isValidMnemonic = (mnemonic) => bip39.validateMnemonic(mnemonic);
export const parseMnemonic = (mnemonic) => (mnemonic || '').trim().toLowerCase().match(/\w+/gu)?.join(' ') || '';

const MnemonicInput = ({ onChange }) => {
  const [mnemonicError, setMnemonicError] = useState('');
  const [pasteFailed, setPasteFailed] = useState(false);
  const [draftMnemonic, setDraftMnemonic] = useState(
    new Array(MNEMONIC_LENGTH).fill(''),
  );
  const [showMnemonic, setShowMnemonic] = useState(
    new Array(MNEMONIC_LENGTH).fill(false),
  );
  const [numberOfWords, setNumberOfWords] = useState(MNEMONIC_LENGTH);
  const { t } = useTranslation();
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
      if (pasteFailed) {
        setPasteFailed(false);
      }
      const newMnemonic = draftMnemonic.slice();
      newMnemonic[index] = newWord.trim();
      onMnemonicChange(newMnemonic);
    },
    [draftMnemonic, onMnemonicChange, pasteFailed],
  );

  const onMnemonicPaste = useCallback(
    (rawMnemonic) => {
      const parsedMnemonic = parseMnemonic(rawMnemonic);
      let newDraftMnemonic = parsedMnemonic.split(' ');

      if (newDraftMnemonic.length > 24) {
        setPasteFailed(true);
        return;
      }
      if (pasteFailed) {
        setPasteFailed(false);
      }

      let newNumberOfWords = numberOfWords;
      if (newDraftMnemonic.length !== numberOfWords) {
        if (newDraftMnemonic.length < 12) {
          newNumberOfWords = 12;
        } else if (newDraftMnemonic.length % 3 === 0) {
          newNumberOfWords = newDraftMnemonic.length;
        } else {
          newNumberOfWords = newDraftMnemonic.length + (3 - (newDraftMnemonic.length % 3));
        }
        setNumberOfWords(newNumberOfWords);
      }

      if (newDraftMnemonic.length < newNumberOfWords) {
        newDraftMnemonic = newDraftMnemonic.concat(
          new Array(newNumberOfWords - newDraftMnemonic.length).fill(''),
        );
      }
      setShowMnemonic(new Array(newNumberOfWords).fill(false));
      onMnemonicChange(newDraftMnemonic);
      clearClipboard();
    },
    [numberOfWords, onMnemonicChange, pasteFailed, setPasteFailed],
  );

  const numberOfWordsOptions = [];
  for (let i = 12; i <= 24; i += 3) {
    numberOfWordsOptions.push({
      name: t('MnemonicInputNumberOfWords', [`${i}`]),
      value: `${i}`,
    });
  }

  return [...Array(MNEMONIC_LENGTH).keys()].map((index) => {
    const id = `mnemonic-word-${index}`;
    return (
      <div key={index} className="import-Mnemonic__Mnemonic-word">
        <label htmlFor={id} className="import-Mnemonic__Mnemonic-word-label">
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
