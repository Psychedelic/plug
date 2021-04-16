import React, { useState } from 'react';
import MuiTabs from '@material-ui/core/Tabs';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import useStyles from './styles';
import Tab from '../Tab';

const Tabs = ({ tabs }) => {
  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleChange = (_event, newValue) => setValue(newValue);
  const handleChangeIndex = (index) => setValue(index);

  return (
    <>
      <MuiTabs
        classes={{
          root: classes.root,
          indicator: classes.indicator,
        }}
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
      >
        {
          tabs.map((tab) => (
            <Tab key={tab.label} label={tab.label} />
          ))
        }
      </MuiTabs>
      <SwipeableViews
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {
          tabs.map((tab, i) => (
            <TabPanel key={tab.label} value={value} index={i}>
              {tab.component}
            </TabPanel>
          ))
        }
      </SwipeableViews>
    </>
  );
};

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {
      (value === index) && children
    }
  </div>
);

export default Tabs;

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    component: PropTypes.element.isRequired,
  })).isRequired,
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};
