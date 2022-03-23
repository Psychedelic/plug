import { useEffect, useState } from 'react';

import resolveICNSName from '@shared/services/ICNS';
import { isICNSName } from '@shared/utils/ids';

import useDebounce from './useDebounce';

export default function useICNS(address, symbol, delay = 500) {
  const debouncedAddress = useDebounce(address, delay);
  const [resolvedAddress, setResolvedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const isICP = symbol === 'ICP';

  useEffect(() => {
    if (debouncedAddress && isICNSName(debouncedAddress)) {
      setLoading(true);
      resolveICNSName(debouncedAddress, isICP)
        .then((response) => {
          setResolvedAddress(response);
          setLoading(false);
        });
    }
  }, [debouncedAddress, symbol, address]);

  return {
    loading, resolvedAddress, isValid: !!resolvedAddress,
  };
}
