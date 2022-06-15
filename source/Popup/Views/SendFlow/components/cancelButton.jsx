import React from 'react';
import { useTranslation } from 'react-i18next';
import { LinkButton } from '@ui';
import { useRouter } from '@components/Router';

const CancelButton = () => {
  const { navigator } = useRouter();
  const { t } = useTranslation();

  return (
    <LinkButton
      value={t('common.cancel')}
      onClick={() => navigator.navigate('home')}
    />
  );
};

export default CancelButton;
