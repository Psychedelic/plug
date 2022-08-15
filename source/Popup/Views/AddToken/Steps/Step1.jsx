import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Tabs } from '@components';
import { useTabs } from '@hooks';

import SearchToken from '../components/SearchToken';
import CustomToken from '../components/CustomToken';

const SEARCH_TAB_ID = 0;
const CUSTOM_TOKENS_TAB_ID = 1;

const Step1 = ({ handleChangeSelectedToken }) => {
  const { t } = useTranslation();
  const { usingMainnet } = useSelector((state) => state.network);
  const defaultTab = usingMainnet ? SEARCH_TAB_ID : CUSTOM_TOKENS_TAB_ID;
  const { selectedTab, handleChangeTab } = useTabs(defaultTab);

  const tabs = [
    {
      label: t('addToken.search'),
      component: <SearchToken
        handleChangeSelectedToken={handleChangeSelectedToken}
        handleChangeTab={handleChangeTab}
      />,
      disabled: !usingMainnet,
    },
    {
      label: t('addToken.custom'),
      component: <CustomToken
        handleChangeSelectedToken={handleChangeSelectedToken}
      />,
    },
  ];

  return (
    <Tabs tabs={tabs} selectedTab={selectedTab} handleChangeTab={handleChangeTab} tabItemTestId="tab-item" />
  );
};

export default Step1;

Step1.propTypes = {
  handleChangeSelectedToken: PropTypes.func.isRequired,
};
