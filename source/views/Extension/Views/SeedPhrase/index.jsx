import React from 'react';
import { Layout, Header } from '@components';
import { useTranslation } from 'react-i18next';
import useSteps from './hooks/useSteps';

const SeedPhrase = () => {
  const { t } = useTranslation();
  const {
    component,
    left,
    right,
  } = useSteps();

  return (
    <Layout>
      <Header left={left} right={right} center={t('seedPhrase.title')} />
      {component}
    </Layout>
  );
};

export default SeedPhrase;
