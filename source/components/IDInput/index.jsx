import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import MInputBase from '@material-ui/core/InputBase';
import BookIcon from '@assets/icons/notebook.svg';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  Button, Dialog, FormItem, InputBase, TextInput,
} from '@ui';
import { CircularProgress, Grid } from '@material-ui/core';
import { getRandomEmoji } from '@shared/constants/emojis';
import { addContact as addContactAction } from '@redux/contacts';

import ActionDialog from '../ActionDialog';
import ContactItem from '../ContactItem';
import ContactList from '../ContactList';
import useStyles from './styles';

const IDInput = ({
  value, onChange, placeholder, isValid, loading,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactsOpened, setIsContactsOpened] = useState(false);
  const [contactName, setContactName] = useState('');
  const [openContacts, setOpenContacts] = useState(false);

  const { principalId, accountId } = useSelector((state) => state.wallet);
  const { groupedContacts: contacts } = useSelector((state) => state.contacts);

  const isUserAddress = useMemo(
    () => [principalId, accountId].includes(value), [principalId, accountId, value],
  );

  const inContacts = useMemo(() => contacts
    .flatMap((c) => c.contacts)
    .map((c) => c.id)
    .includes(value), [contacts, value]);

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
    setContactName(e.target.value);
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
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || t('send.inputId')}
            />
            <div className={classes.iconContainer}>
              {loading ? (
                <CircularProgress size={24} />
              )
                : contacts.length > 0 && (
                <img
                  className={classes.icon}
                  src={BookIcon}
                  onClick={() => setOpenContacts(true)}
                />
                )}
              <Dialog
                title={t('contacts.title')}
                onClose={handleCloseContacts}
                selectedValue={selectedContact}
                open={openContacts}
                component={(
                  <ContactList
                    selectable
                    onClick={handleSelectContact}
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
                      <TextInput
                        fullWidth
                        value={contactName}
                        onChange={handleChangeContactName}
                        type="text"
                      />
                    )}
                  />
                )}
                button={t('common.add')}
                buttonVariant="rainbow"
                onClick={addContact}
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
