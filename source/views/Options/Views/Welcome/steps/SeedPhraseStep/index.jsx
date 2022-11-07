import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Button, Checkbox, SeedPhrase,
} from '@components';
import useStyles from './styles';

const SeedPhraseStep = ({ handleNextStep, mnemonic }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const classes = useStyles();

  const handleChangeCheckbox = (event) => { setChecked(event.target.checked); };

  if (mnemonic) {
    return (
      <div className={classes.seedphraseStepContainer}>
        <div className={classes.seedPhraseContainer}>
          <SeedPhrase words={mnemonic.split(' ')} onReveal={() => setReveal(true)} />
        </div>
        <Checkbox
          style={{ marginRight: 10 }}
          checked={checked}
          handleChange={handleChangeCheckbox}
          label={t('welcome.seedCheckbox')}
          className={classes.checkbox}
          data-testid="seedphrase-confirmation-checkbox"
        />
        <Button
          variant="rainbow"
          value={t('common.continue')}
          onClick={handleNextStep}
          disabled={!checked || !reveal}
          data-testid="reveal-seedphrase-continue-button"
          fullWidth
        />
      </div>
    );
  }

  return null;
};

export default SeedPhraseStep;

SeedPhraseStep.defaultProps = {
  mnemonic: null,
};

SeedPhraseStep.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  mnemonic: PropTypes.arrayOf(PropTypes.string),
};
