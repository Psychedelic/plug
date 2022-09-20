import React from 'react';
import { Layout, Header } from '@components';
import useSteps from './hooks/useSteps';

const ImportWallet = () => {
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

export default ImportWallet;
