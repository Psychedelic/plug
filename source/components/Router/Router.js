import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { setRouter } from '@modules/storageManager';

export const RouteContext = React.createContext();
export const RouteUpdateContext = React.createContext();

export const TABS = {
  TOKENS: 0,
  NFTS: 1,
  ACTIVITY: 2,
  APPS: 3,
};

const Router = (props) => {
  const { children, initialRouteName } = props;

  const [route, setRoute] = useState(initialRouteName);
  const [previousRoute, setPreviousRoute] = useState(null);
  const [tabIndex, setTabIndex] = useState(TABS.TOKENS);

  const navigate = (routeName, tab = TABS.TOKENS) => {
    setPreviousRoute(route);
    setRoute(routeName);
    setTabIndex(tab);
  };

  // We go back between the two available routes. No history is collected.
  const goBack = () => {
    const currentRoute = route;
    setRoute(previousRoute);
    setPreviousRoute(currentRoute);
  };

  const navigationObject = {
    navigate,
    goBack,
  };

  useEffect(() => {
    setRouter(route);
  }, [route]);

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

Router.defaultProps = {
  children: null,
  initialRouteName: null,
};

Router.propTypes = {
  children: PropTypes.node,
  initialRouteName: PropTypes.string,
};

export default Router;
