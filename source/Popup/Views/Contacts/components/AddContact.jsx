import React, { useState } from 'react';
import FleekImg from '@assets/icons/Fleek.svg';
import Grid from '@material-ui/core/Grid';
import {
  FormItem, Container, Button, TextInput,
} from '@ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { validateAccountId, validatePrincipalId } from '../../Send/hooks/utils';

const AddContact = ({ handleAddContact }) => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [isValidId, setIsValidId] = useState(null);

  const handleChangeName = (e) => setName(e.target.value);

  const handleChangeId = (e) => {
    const { value } = e.target;
    setId(value);
    setIsValidId(validatePrincipalId(value) || validateAccountId(value));
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            label={t('contacts.name')}
            component={(
              <TextInput
                fullWidth
                value={name}
                onChange={handleChangeName}
                type="text"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormItem
            label={t('contacts.id')}
            component={(
              <TextInput
                fullWidth
                value={id}
                onChange={handleChangeId}
                type="text"
                error={isValidId === false}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="rainbow"
            value={t('common.add')}
            disabled={
              id === ''
              || name === ''
              || !isValidId
            }
            onClick={() => handleAddContact({
              name,
              id,
              image: FleekImg,
            })}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddContact;

AddContact.propTypes = {
  handleAddContact: PropTypes.func.isRequired,
};
