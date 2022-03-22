import { useEffect, useState } from 'react';

import resolveICNSName from '@shared/services/ICNS';
import { isICNSName } from '@shared/utils/ids';

import useDebounce from './useDebounce';

export default function useICNS(address, isICP, delay = 500) {
  const debouncedAddress = useDebounce(address, delay);
  const [resolvedAddress, setResolvedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debouncedAddress && isICNSName(debouncedAddress)) {
      setLoading(true);
      console.log('resolving icns');
      resolveICNSName(debouncedAddress, isICP)
        .then((response) => {
          console.log('resolved?', response);
          setResolvedAddress(response);
          setLoading(false);
        });
    }
  }, [debouncedAddress, isICP]);

  return {
    loading, resolvedAddress, isValid: !!resolvedAddress,
  };
}
