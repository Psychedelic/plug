import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox } from '@ui';
import { SeedPhrase } from '@components';

const WORDS = [ // get from somewhere
  'spread',
  'spoon',
  'foam',
  'door',
  'young',
  'uniform',
  'lab',
  'add',
  'jungle',
  'display',
  'clean',
  'parrot',
];

const SeedPhraseStep = ({ handleNextStep }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);

  const handleChangeCheckbox = (event) => { setChecked(event.target.checked); };

  return (
    <>
      <Grid item xs={12} style={{ height: 185 }}>
        <SeedPhrase words={WORDS} />
      </Grid>
      <Grid item xs={12}>
        <Checkbox style={{ margin: 0 }} checked={checked} handleChange={handleChangeCheckbox} label={t('welcome.seedCheckbox')} />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="rainbow"
          value={t('common.continue')}
          onClick={handleNextStep}
          fullWidth
          disabled={!checked}
        />
      </Grid>
    </>
  );
};

export default SeedPhraseStep;

SeedPhraseStep.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
};
