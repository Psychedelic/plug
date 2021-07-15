import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import {
  FormItem, Container, Button, TextInput,
} from '@ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import EMOJIS from '@shared/constants/emojis';
import { Typography } from '@material-ui/core';
import { validatePrincipalId, validateAccountId } from '@shared/utils/ids';
import useStyles from '../styles';

const AddContact = ({ handleAddContact, contacts }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [name, setName] = useState('');
  const [id, setId] = useState(null);
  const [isValidId, setIsValidId] = useState(null);
  const [invalidReason, setInvalidReason] = useState('');

  const handleChangeName = (e) => setName(e.target.value);

  const handleChangeId = (e) => {
    const { value } = e.target;
    setId(value);
  };

  const validateContact = () => {
    const isValid = validatePrincipalId(id) || validateAccountId(id);

    if (isValid) {
      setIsValidId(true);
      setInvalidReason('');
    } else {
      setIsValidId(false);
      setInvalidReason(
        t('contacts.errorId'),
      );
    }

    if (contacts.some((c) => c.id === id)) {
      const existingContact = contacts.find((c) => c.id === id);
      setIsValidId(false);
      setInvalidReason(
        t('contacts.errorExists').replace('{name}', existingContact.name),
      );
    }
  };

  useEffect(() => {
    if (id) {
      validateContact();
    } else {
      setInvalidReason('');
    }
  }, [id]);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormItem
            smallLabel
            label={t('contacts.name')}
            component={(
              <TextInput
                fullWidth
                value={name}
                onChange={handleChangeName}
                inputProps={{ maxLength: 25 }}
                type="text"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <FormItem
            smallLabel
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
        {
          invalidReason
          && (
          <Grid item xs={12} className={classes.appearAnimation}>
            <Typography variant="subtitle1" className={classes.danger}>{invalidReason}</Typography>
          </Grid>
          )
        }
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
              image: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
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
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
};
