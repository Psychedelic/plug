import { useContext } from 'react';

import { RouteContext, RouteUpdateContext } from '../../Router';

const useRouter = () => {
  const route = useContext(RouteContext);
  const navigator = useContext(RouteUpdateContext);

  return {
    route,
    navigator,
  };
};

export default useRouter;
