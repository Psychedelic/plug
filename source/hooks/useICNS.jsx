import { useEffect, useState } from 'react';

import { resolveName } from '@shared/services/ICNS';
import { isICNSName } from '@shared/utils/ids';

import useDebounce from './useDebounce';

export default function useICNS(address, symbol, delay = 300) {
  const debouncedAddress = useDebounce(address, delay);
  const [resolvedAddress, setResolvedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const isICP = symbol === 'ICP';

  useEffect(() => {
    if (debouncedAddress === address && isICNSName(address)) {
      setLoading(true);
      resolveName(debouncedAddress, isICP)
        .then((response) => {
          setResolvedAddress(response);
          setLoading(false);
        })
        .catch((err) => {
          setResolvedAddress(null);
          // eslint-disable-next-line
          console.warn(err);
        });
    }
    if (!isICNSName(address)) setResolvedAddress(null);
  }, [debouncedAddress, symbol, address]);

  return {
    loading, resolvedAddress, isValid: !!resolvedAddress,
  };
}
