import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import MInputBase from '@material-ui/core/InputBase';
import BookIcon from '@assets/icons/notebook.svg';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { CircularProgress, Grid, Typography } from '@material-ui/core';
import { getRandomEmoji } from '@shared/constants/emojis';
import { getContacts, addContact as addContactAction } from '@redux/contacts';

import ActionDialog from '../ActionDialog';
import ContactItem from '../ContactItem';
import ContactList from '../ContactList';
import Button from '../Button';
import Dialog from '../Dialog';
import FormItem from '../FormItem';
import InputBase from '../InputBase';
import TextInput from '../TextInput';
import useStyles from './styles';

const IDInput = ({
  value, onChange, placeholder, isValid, loading, ...other
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactsOpened, setIsContactsOpened] = useState(false);
  const [contactName, setContactName] = useState('');
  const [openContacts, setOpenContacts] = useState(false);
  const [contactsError, setContactsError] = useState(null);

  const { principalId, accountId } = useSelector((state) => state.wallet);
  const { contacts } = useSelector((state) => state.contacts);
  const { contactsLoading } = useSelector((state) => state.contacts);

  useEffect(() => {
    dispatch(getContacts());
  }, []);

  const isUserAddress = useMemo(
    () => [principalId, accountId].includes(value), [principalId, accountId, value],
  );

  const inContacts = useMemo(() => !!contacts.find(
    (contact) => (contact.id === value),
  ), [contacts, value]);

  const shouldDisplayAddToContacts = value !== null && value !== ''
    && !loading && isValid && !inContacts && !isUserAddress;

  const handleSelectedContact = (contact) => setSelectedContact(contact);

  const handleCloseContacts = (contact) => {
    handleSelectedContact(contact);
    setOpenContacts(false);
  };

  const handleSelectContact = (contact) => {
    handleSelectedContact(contact);
    onChange(contact.id);
    setOpenContacts(false);
  };

  const handleCancelContact = () => {
    onChange('');
    handleSelectedContact(null);
  };

  const addContact = () => {
    if (loading) return;
    const contact = {
      name: contactName,
      id: value,
      image: getRandomEmoji(),
    };
    dispatch(addContactAction(contact));
    setSelectedContact(contact);
    onChange(contact.id);
    setIsContactsOpened(false);
    setContactName('');
  };

  const handleChangeContactName = (e) => {
    const name = e.target.value;
    const existingContact = contacts.find((contact) => contact.name === name);
    const error = existingContact ? t('contacts.errorExists').replace('{name}', existingContact.name) : null;
    setContactsError(error);
    setContactName(name);
  };

  const searchContactFromId = (e) => {
    const id = e.target.value;
    onChange(id);
    setSelectedContact(contacts.find((contact) => contact.id === id));
  };

  return (
    <>
      <div className={classes.root}>
        {selectedContact ? (
          <InputBase>
            <ContactItem
              contact={selectedContact}
              handleCancel={handleCancelContact}
            />
          </InputBase>
        ) : (
          <>
            <MInputBase
              classes={{
                input: clsx(
                  classes.input,
                  !!value && !isValid && classes.inputInvalid,
                  !!contacts.length && classes.paddingRight,
                ),
              }}
              fullWidth
              value={value}
              type="text"
              onChange={searchContactFromId}
              placeholder={placeholder || t('send.inputId')}
              {...other}
            />
            <div className={classes.iconContainer}>
              {(contactsLoading || loading) ? (
                <CircularProgress size={24} />
              )
                : contacts.length > 0 && (
                <img
                  className={classes.icon}
                  src={BookIcon}
                  onClick={() => setOpenContacts(true)}
                  data-testid="address-book-icon"
                />
                )}
              <Dialog
                title={t('contacts.title')}
                onClose={handleCloseContacts}
                selectedValue={selectedContact}
                open={openContacts}
                titleTestId="contacts-dialog"
                component={(
                  <ContactList
                    selectable
                    onClick={handleSelectContact}
                    contactTestId="contact-name"
                  />
                )}
              />
            </div>
          </>
        )}
      </div>
      {shouldDisplayAddToContacts && (
        <Grid item xs={12}>
          <div className={clsx(classes.newAddress, classes.appearAnimation)}>
            <span className={classes.newAddressTitle}>
              {t('contacts.newAddress')}
            </span>
            <Button
              variant="primary"
              value={t('contacts.addContact')}
              onClick={() => setIsContactsOpened(true)}
              data-testid="add-contact-button"
              style={{
                minWidth: 118,
                height: 27,
                borderRadius: 6,
              }}
            />
            {isContactsOpened && (
              <ActionDialog
                open={isContactsOpened}
                title={t('contacts.addToContacts')}
                content={(
                  <FormItem
                    label={t('contacts.name')}
                    smallLabel
                    component={(
                      <>
                        <TextInput
                          fullWidth
                          value={contactName}
                          onChange={handleChangeContactName}
                          type="text"
                          data-testid="contact-name-input"
                          error={!!contactsError}
                        />
                        <Typography variant="subtitle1" className={classes.danger} data-testid="error">{contactsError}</Typography>
                      </>
                    )}
                  />
                )}
                confirmText={t('common.add')}
                buttonVariant="rainbow"
                onClick={addContact}
                submitButtonProps={{ 'data-testid': 'confirm-adding-contact-button', disabled: !contactName || !!contactsError }}
                onClose={() => setIsContactsOpened(false)}
              />
            )}
          </div>
        </Grid>
      )}
    </>
  );
};

IDInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  isValid: PropTypes.bool,
  loading: PropTypes.bool,
};

IDInput.defaultProps = {
  isValid: true,
  loading: false,
};

export default IDInput;
