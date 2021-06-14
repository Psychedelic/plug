import React from 'react';
import { Tabs } from '@ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import SearchToken from '../components/SearchToken';
import CustomToken from '../components/CustomToken';

const Step1 = ({ handleChangeSelectedToken }) => {
  const { t } = useTranslation();

  const tabs = [
    {
      label: t('addToken.search'),
      component: <SearchToken
        handleChangeSelectedToken={handleChangeSelectedToken}
      />,
    },
    {
      label: t('addToken.custom'),
      component: <CustomToken
        handleChangeSelectedToken={handleChangeSelectedToken}
      />,
    },
  ];

  return (
    <Tabs tabs={tabs} />
  );
};

export default Step1;

Step1.propTypes = {
  handleChangeSelectedToken: PropTypes.func.isRequired,
};
