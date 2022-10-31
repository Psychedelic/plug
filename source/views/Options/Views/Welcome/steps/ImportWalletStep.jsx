import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { Button, FormItem, TextInput } from '@components';
import MnemonicInput from '../components/MnemonicInput';
import * as bip39 from 'bip39';

const ImportWalletStep = ({ handleNextStep, handleSetMnemonic }) => {
  const { t } = useTranslation();

  const [text, setText] = useState('');
  const [invalidMnemonic, setInvalidMnemonic] = useState(false);

  const handleChangeText = (e) => {
    setText(e.target.value);
    setInvalidMnemonic(false);
  };

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

  const handleValidateMnemonic = () => (
    text === ''
    || text.trim().split(/\s+/g).length !== 12
    || invalidMnemonic
  );

  return (
    <>
      <Grid item xs={12}>
        <FormItem
          label={t('welcome.importLabel')}
          component={(
            <MnemonicInput onChange={setText} />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="rainbow"
          value={t('welcome.importButton')}
          onClick={handleImportMnemonic}
          fullWidth
          disabled={handleValidateMnemonic()}
          data-testid="confirm-seedphrase-button"
        />
      </Grid>
    </>
  );
};

export default ImportWalletStep;

ImportWalletStep.propTypes = {
  handleNextStep: PropTypes.func.isRequired,
  handleSetMnemonic: PropTypes.func.isRequired,
};
