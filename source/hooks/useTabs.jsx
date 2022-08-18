import { useState } from 'react';

const useTabs = (defaultTab = 0) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  const handleChangeTab = (value) => setSelectedTab(value);

  return { selectedTab, handleChangeTab };
};

export default useTabs;
