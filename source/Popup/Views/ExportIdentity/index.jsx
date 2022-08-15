import React from 'react';
import { Layout, Header } from '@components';
import { useTranslation } from 'react-i18next';
import useSteps from './hooks/useSteps';

const ExportIdentity = () => {
  const { t } = useTranslation();
  const {
    component,
    left,
    right,
  } = useSteps();

  return (
    <Layout>
      <Header left={left} right={right} center={t('exportIdentity.title')} />
      {
        component
      }
    </Layout>
  );
};

export default ExportIdentity;
