import React from 'react';
import MuiTabs from '@material-ui/core/Tabs';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import useStyles from './styles';
import Tab from '../Tab';

const Tabs = ({
  tabs, selectedTab, handleChangeTab, tabItemTestId,
}) => {
  const classes = useStyles();
  const handleChange = (_event, newValue) => handleChangeTab(newValue);
  const handleChangeIndex = (index) => handleChangeTab(index);

  return (
    <>
      <MuiTabs
        classes={{
          root: classes.root,
          indicator: classes.indicator,
        }}
        value={selectedTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
      >
        {
          tabs.map((tab) => (
            <Tab
              key={tab.label}
              label={tab.label}
              loading={tab.loading}
              data-testid={`${tabItemTestId}-${tab.label}`}
              disabled={tab.disabled}
            />
          ))
        }
      </MuiTabs>
      <SwipeableViews
        index={selectedTab}
        onChangeIndex={handleChangeIndex}
      >
        {
          tabs.map((tab, i) => (
            <TabPanel key={tab.label} value={selectedTab} index={i} classes={classes}>
              {tab.component}
            </TabPanel>
          ))
        }
      </SwipeableViews>
    </>
  );
};

const TabPanel = ({
  children, value, index, classes,
}) => (
  <div hidden={value !== index} className={classes.tabPanel}>
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
  selectedTab: PropTypes.number.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
  tabItemTestId: PropTypes.string,
};

Tabs.defaultProps = {
  tabItemTestId: '',
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};
