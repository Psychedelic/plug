import React, { useRef, useEffect } from 'react';
import { bool, node, string } from 'prop-types';

import Loading from './components/Loading';

function LoadingWrapper({
  loading, children, withInitialLoading, className,
}) {
  const initialLoading = useRef(withInitialLoading);
  useEffect(() => {
    if (initialLoading.current && loading) {
      initialLoading.current = false;
    }
  }, [loading]);
  return initialLoading.current || loading ? <Loading className={className} /> : <>{children}</>;
}

LoadingWrapper.propTypes = {
  loading: bool.isRequired,
  children: node.isRequired,
  className: string,
  withInitialLoading: bool,
};

LoadingWrapper.defaultProps = {
  className: '',
  withInitialLoading: false,
};

export default LoadingWrapper;
