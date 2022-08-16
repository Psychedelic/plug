import React, { useEffect } from 'react';
import { Layout } from '@components';
import { Header } from '@ui';
import useSteps from './hooks/useSteps';
import { useContacts } from '@hooks';

const Contacts = () => {
  const {
    component,
    left,
    right,
    center,
  } = useSteps();
  const { getContacts } = useContacts();

  useEffect(getContacts, []);

  return (
    <Layout>
      <Header left={left} center={center} right={right} />
      {component}
    </Layout>
  );
};

export default Contacts;
