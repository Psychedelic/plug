import React from 'react';
import { useTranslation } from 'react-i18next';
import { LinkButton } from '@components';
import { useRouter } from '@components/Router';

const CancelButton = () => {
  const { navigator } = useRouter();
  const { t } = useTranslation();

  return (
    <LinkButton
      value={t('common.cancel')}
      spanTestId="cancel-button"
      onClick={() => navigator.navigate('home')}
    />
  );
};

export default CancelButton;
