import React from 'react';
import { Layout } from '@components';
import { Header } from '@ui';
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
      <Header left={left} right={right} value={t('seedPhrase.title')} />
      {
        component
      }
    </Layout>
  );
};

export default SeedPhrase;
