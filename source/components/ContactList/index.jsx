import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ActionDialog from '../ActionDialog';
import ContactItem from '../ContactItem';
import useStyles from './styles';

const ContactList = ({
  handleRemoveContact, selectable, onClick,
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const { groupedContacts: contacts } = useSelector((state) => state.contacts);

  const classes = useStyles();

  return (
    <div className={classes.contactContainer}>
      {
        [...contacts].sort((a, b) => a.letter.localeCompare(b.letter)).map((item) => (
          <>
            <div className={classes.divider}>
              {item.letter}
            </div>
            {
              [...item.contacts].sort((a, b) => a.name.localeCompare(b.name)).map((contact) => (
                <ContactItem
                  key={contact.id}
                  contact={contact}
                  handleClick={selectable ? onClick : null}
                  contactTestId="contact-name"
                  handleDelete={selectable
                    ? null
                    : () => { setSelectedContact(contact); setOpen(true); }}
                />
              ))
            }
          </>
        ))
      }
      <div className={classes.line} />
      {
        open
        && (
          <ActionDialog
            open={open}
            title={t('contacts.deleteTitle')}
            content={<Typography>{t('contacts.deleteText')} <b>{selectedContact.name}</b>?</Typography>}
            confirmText={t('contacts.deleteButton')}
            buttonVariant="danger"
            onClick={() => { handleRemoveContact(selectedContact); setOpen(false); }}
            onClose={() => setOpen(false)}
            submitButtonProps={{
              'data-testid': 'confirm-deleting-button',
            }}
          />
        )
      }
    </div>
  );
};

export default ContactList;

ContactList.propTypes = {
  handleRemoveContact: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  selectable: PropTypes.bool,
};

ContactList.defaultProps = {
  onClick: null,
  selectable: false,
};
