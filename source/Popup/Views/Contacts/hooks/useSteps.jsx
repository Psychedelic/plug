import React, { useState } from 'react';
import { LinkButton, Button } from '@ui';
import BackIcon from '@assets/icons/back.svg';
import { useTranslation } from 'react-i18next';
import { useRouter } from '@components/Router';
import { useContacts } from '@hooks';
import { ContactList } from '@components';
import AddContact from '../components/AddContact';
import Home from '../components/Home';

const useSteps = () => {
  const {
    contacts, handleAddContact, handleRemoveContact, ungroupedContacts,
  } = useContacts();
  const [currentView, setCurrentView] = useState(0);

  const { navigator } = useRouter();
  const { t } = useTranslation();

  const handleChangeView = (index) => setCurrentView(index);

  const addContact = (contact) => {
    handleAddContact(contact);
    handleChangeView(0);
  };

  const leftButton = (onClick) => <LinkButton value={t('common.back')} onClick={onClick} startIcon={BackIcon} />;

  const firstView = contacts.length > 0
    ? {
      component: <ContactList contacts={contacts} handleRemoveContact={handleRemoveContact} />,
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
      component: <AddContact handleAddContact={addContact} contacts={ungroupedContacts} />,
      left: leftButton(() => handleChangeView(0)),
      right: null,
      center: t('contacts.addContact'),
    },
  ];

  return views[currentView];
};

export default useSteps;
