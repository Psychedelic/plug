import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getContacts } from '@redux/contacts';
import { Layout, Header } from '@components';
import useSteps from './hooks/useSteps';

const Send = () => {
  const {
    component,
    left,
    right,
    center,
  } = useSteps();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getContacts());
  }, []);

  return (
    <Layout>
      <Header left={left} center={center} right={right} />
      {component}
    </Layout>
  );
};

export default Send;
