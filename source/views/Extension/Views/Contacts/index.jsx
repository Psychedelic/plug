import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { Layout, Header } from '@components';
import { getContacts } from '@redux/contacts';
import useSteps from './hooks/useSteps';

const Contacts = () => {
  const {
    component,
    left,
    right,
    center,
  } = useSteps();
  const dispatch = useDispatch();

  useEffect(() => { dispatch(getContacts()); }, []);

  return (
    <Layout>
      <Header left={left} center={center} right={right} />
      {component}
    </Layout>
  );
};

export default Contacts;
