import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import Info from '@assets/icons/info.svg';

import { TextInput } from '@components';
import { createArray } from '@shared/utils/array';

import useStyles from './styles';
import ShowHideToggle from '../ShowHideToggle';
import { clearClipboard, parseMnemonic } from './utils';

const MNEMONIC_LENGTH = 12;

const MnemonicInput = ({ onChange, draftMnemonic }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [pasteFailed, setPasteFailed] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(createArray(MNEMONIC_LENGTH, false));

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
      onChange(newMnemonic);
    },
    [draftMnemonic, onChange],
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
      onChange(newDraftMnemonic);
      clearClipboard();
    },
    [onChange, pasteFailed, setPasteFailed],
  );

  return (
    <div className={classes.container}>
      <div className={classes.pasteMessage}>
        <img src={Info} alt="info" className={classes.infoIcon} />
        {t('welcome.pasteMnemonic')}
      </div>
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
    </div>
  );
};

MnemonicInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  draftMnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MnemonicInput;
