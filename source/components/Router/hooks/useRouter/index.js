import { useContext } from 'react';

import { RouteContext, RouteUpdateContext } from '../../Router';

const useRouter = () => {
  const routeContext = useContext(RouteContext);
  const navigator = useContext(RouteUpdateContext);

  const { route, tabIndex, routeProps } = routeContext;

  return {
    route,
    navigator,
    tabIndex,
    routeProps,
  };
};

export default useRouter;
