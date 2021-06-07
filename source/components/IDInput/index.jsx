import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MInputBase from '@material-ui/core/InputBase';
import BookIcon from '@assets/icons/notebook.svg';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  InputBase,
} from '@ui';
import ContactItem from '../ContactItem';
import ContactList from '../ContactList';
import useStyles from './styles';

const IDInput = ({
  value,
  onChange,
  addressInfo,
  handleChangeAddressInfo,
  contacts,
  selectedContact,
  handleSelectedContact,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [openContacts, setOpenContacts] = useState(false);

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

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (value !== null) {
        const isValid = value.includes('valid id') && (value.includes('dank') || value.includes('canister'));

        let type = null;
        if (value.includes('dank')) type = 'dank';
        else if (value.includes('canister')) type = 'canister';

        handleChangeAddressInfo({ isValid, type });
      }
    }, 1000);

    return () => clearTimeout(debounce);
  }, [value]);

  return (
    <div className={classes.root}>
      {
        selectedContact
          ? (
            <InputBase>
              <ContactItem contact={selectedContact} handleCancel={handleCancelContact} />
            </InputBase>
          )
          : (
            <>
              <MInputBase
                classes={{
                  input: clsx(classes.input, addressInfo.isValid === false && classes.inputInvalid),
                }}
                fullWidth
                value={value}
                type="text"
                onChange={(e) => onChange(e.target.value)}
                placeholder={t('send.inputId')}
              />
              <div className={classes.iconContainer}>
                {
                  contacts.length > 0
                  && (
                    <img
                      className={classes.icon}
                      src={BookIcon}
                      onClick={() => setOpenContacts(true)}
                    />
                  )
                }
                <Dialog
                  title={t('contacts.title')}
                  onClose={handleCloseContacts}
                  selectedValue={selectedContact}
                  open={openContacts}
                  component={(
                    <ContactList
                      contacts={contacts}
                      selectable
                      onClick={handleSelectContact}
                    />
                  )}
                />
              </div>
            </>
          )
      }
    </div>
  );
};

export default IDInput;

IDInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  addressInfo: PropTypes.objectOf(PropTypes.object).isRequired,
  handleChangeAddressInfo: PropTypes.func.isRequired,
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedContact: PropTypes.objectOf(PropTypes.object).isRequired,
  handleSelectedContact: PropTypes.func.isRequired,
};
