import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const RouteContext = React.createContext();
export const RouteUpdateContext = React.createContext();

const ROUTER_KEY = 'router';
const TAB_KEY = 'tab';

const Router = (props) => {
  const { storage, children, initialRouteName } = props;

  const [route, setRoute] = useState(initialRouteName);
  const [tabIndex, setTabIndex] = useState(0);

  const navigate = (routeName, tab = 0) => storage.local.set({
    [ROUTER_KEY]: routeName,
    [TAB_KEY]: tab,
  });

  const navigationObject = {
    navigate,
  };

  useEffect(() => {
    storage.onChanged.addListener((changeObject) => {
      if (changeObject[ROUTER_KEY]) {
        setRoute(changeObject[ROUTER_KEY].newValue);
        setTabIndex(changeObject[TAB_KEY].newValue);
      }
    });

    storage.local.get([ROUTER_KEY], (routerState) => {
      if (routerState[ROUTER_KEY]) {
        setRoute(routerState[ROUTER_KEY]);
        setTabIndex(routerState[TAB_KEY]);
      }
    });
  }, []);

  const content = React.Children.toArray(children).filter((component) => {
    if (component.type.componentName !== 'Route') {
      throw new Error("Router children isn't a valid Route component");
    }

    return route === component.props.name;
  });

  return (
    <RouteContext.Provider value={{ route, tabIndex }}>
      <RouteUpdateContext.Provider value={navigationObject}>
        {content}
      </RouteUpdateContext.Provider>
    </RouteContext.Provider>
  );
};

export const storagePropType = {
  onChanged: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  local: PropTypes.shape({
    set: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
  }).isRequired,
};

Router.defaultProps = {
  children: null,
  initialRouteName: null,
};

Router.propTypes = {
  children: PropTypes.node,
  initialRouteName: PropTypes.string,
  storage: PropTypes.shape(storagePropType).isRequired,
};

export default Router;
