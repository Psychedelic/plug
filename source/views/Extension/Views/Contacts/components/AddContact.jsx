import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import {
  FormItem, Container, Button, TextInput,
} from '@components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { getRandomEmoji } from '@shared/constants/emojis';
import { Typography } from '@material-ui/core';
import { validateAddress } from '@shared/utils/ids';

import { useICNS } from '@hooks';

import useStyles from '../styles';

const AddContact = ({ handleAddContact }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { contacts } = useSelector((state) => state.contacts);

  const [name, setName] = useState('');
  const [id, setId] = useState(null);
  const [isValidId, setIsValidId] = useState(null);
  const [invalidReason, setInvalidReason] = useState('');
  const { loading, isValid: isValidICNS } = useICNS(id, '', 500);

  const handleChangeName = (e) => setName(e.target.value);

  const handleChangeId = (e) => {
    const { value } = e.target;
    setId(value.trim());
  };

  const addContact = () => handleAddContact({ name, id, image: getRandomEmoji() });

  const validateContact = () => {
    const isValid = validateAddress(id) || isValidICNS;

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
  }, [id, isValidICNS]);

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
                data-testid="name-input"
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
                data-testid="principalid-input"
              />
            )}
          />
        </Grid>
        {
          invalidReason
          && (
            <Grid item xs={12} className={classes.appearAnimation}>
              <Typography variant="subtitle1" className={classes.danger} data-testid="error">{invalidReason}</Typography>
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
            loading={loading}
            onClick={addContact}
            data-testid="add-button"
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
