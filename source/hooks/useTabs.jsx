import { useState } from 'react';

const useTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (value) => setSelectedTab(value);

  return { selectedTab, handleChangeTab };
};

export default useTabs;
