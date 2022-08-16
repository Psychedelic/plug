import React from 'react';
import { Layout } from '@components';
import { Header } from '@ui';
import useSteps from './hooks/useSteps';

const Swap = () => {
  const {
    component,
    left,
    right,
    center,
  } = useSteps();

  return (
    <Layout>
      <Header left={left} center={center} right={right} />
      {component}
    </Layout>
  );
};

export default Swap;
