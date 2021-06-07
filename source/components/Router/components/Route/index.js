import React from 'react';
import PropTypes from 'prop-types';

const Route = (props) => {
  const { name, component: Component } = props;

  if (!name) {
    throw new Error('Missing Route name prop');
  }

  if (!Component) {
    throw new Error('Missing Route component prop');
  }

  return <Component name={name} />;
};

Route.propTypes = {
  name: PropTypes.string.isRequired,
  component: PropTypes.elementType.isRequired,
};

Route.componentName = 'Route';

export default Route;
