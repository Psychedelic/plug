import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ActionDialog from '../ActionDialog';
import ContactItem from '../ContactItem';
import useStyles from './styles';

const GroupedDisplay = ({ data, ItemComponent, itemProps }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <div className={classes.contactContainer}>
      {
        [...data].sort((a, b) => a.letter.localeCompare(b.letter)).map((group) => (
          <>
            <div className={classes.divider}>
              {group.letter}
            </div>
            {
              [...item.contacts].sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                <ItemComponent {...item} {...itemProps} />
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

export default GroupedDisplay;

GroupedDisplay.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  handleRemoveContact: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  selectable: PropTypes.bool,
};

GroupedDisplay.defaultProps = {
  onClick: null,
  selectable: false,
};
