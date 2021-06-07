import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { Button, FormItem, TextInput } from '@ui';

const ImportWalletStep = ({ handleNextStep }) => {
  const { t } = useTranslation();

  const [text, setText] = useState('');

  const handleChangeText = (e) => {
    setText(e.target.value);
  };

  return (
    <>
      <Grid item xs={12}>
        <FormItem
          label={t('welcome.importLabel')}
          component={(
            <TextInput
              fullWidth
              value={text}
              onChange={handleChangeText}
              type="text"
              multiline
              rows={4}
            />
)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="rainbow"
          value={t('welcome.importButton')}
          onClick={handleNextStep}
          fullWidth
          disabled={text === ''}
        />
      </Grid>
    </>
  );
};

export default ImportWalletStep;

ImportWalletStep.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
};
