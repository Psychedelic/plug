import React from 'react';
import { Tabs } from '@ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useTabs } from '@hooks';
import SearchToken from '../components/SearchToken';
import CustomToken from '../components/CustomToken';

const Step1 = ({ handleChangeSelectedToken }) => {
  const { t } = useTranslation();
  const { selectedTab, handleChangeTab } = useTabs();

  const tabs = [
    {
      label: t('addToken.search'),
      component: <SearchToken
        handleChangeSelectedToken={handleChangeSelectedToken}
        handleChangeTab={handleChangeTab}
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
    <Tabs tabs={tabs} tabItemTestId="tab-item" selectedTab={selectedTab} handleChangeTab={handleChangeTab} />
  );
};

export default Step1;

Step1.propTypes = {
  handleChangeSelectedToken: PropTypes.func.isRequired,
};
