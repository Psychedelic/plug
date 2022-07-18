import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkButton, Button, ContactList } from '@components';
import {
  addContact,
  removeContact,
} from '@redux/contacts';
import BackIcon from '@assets/icons/back.svg';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import AddContact from '../components/AddContact';
import Home from '../components/Home';

const useSteps = () => {
  const {
    groupedContacts: contacts,
  } = useSelector((state) => state.contacts);

  const [currentView, setCurrentView] = useState(0);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { navigator } = useRouter();

  const handleChangeView = (index) => setCurrentView(index);

  const handleRemoveContact = (contact) => dispatch(removeContact(contact));

  const handleAddContact = (contact) => {
    dispatch(addContact(contact));
    handleChangeView(0);
  };

  const leftButton = (onClick) => <LinkButton value={t('common.back')} onClick={onClick} startIcon={BackIcon} data-testid="back-button" />;

  const firstView = contacts.length > 0
    ? {
      component: <ContactList handleRemoveContact={handleRemoveContact} />,
      left: leftButton(() => navigator.navigate('settings')),
      right: <Button
        variant="rainbowOutlined"
        value={t('common.add')}
        onClick={() => handleChangeView(1)}
        style={{
          minWidth: 75,
          height: 27,
          borderRadius: 6,
        }}
        data-testid="add-contact-button"
      />,
      center: t('contacts.title'),
    }
    : {
      component: <Home handleChangeView={() => handleChangeView(1)} />,
      left: leftButton(() => navigator.navigate('settings')),
      right: <LinkButton value={t('common.done')} onClick={() => navigator.navigate('home')} />,
      center: t('contacts.title'),
    };

  const views = [
    {
      ...firstView,
    },
    {
      component: <AddContact handleAddContact={handleAddContact} />,
      left: leftButton(() => handleChangeView(0)),
      right: null,
      center: t('contacts.addContact'),
    },
  ];

  return views[currentView];
};

export default useSteps;
