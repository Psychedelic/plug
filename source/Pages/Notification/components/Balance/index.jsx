import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PortRPC } from '@fleekhq/browser-rpc';

const portRPC = new PortRPC({
  name: 'transfer-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const Balance = ({
  args: accountId, metadata, callId, portId,
}) => {
  useEffect(async () => {
    if (metadata && accountId !== undefined && callId && portId) {
      await portRPC.call('handleRequestBalance', [metadata.url, accountId, callId, portId]);
      window.close();
    }
  }, [metadata, accountId, callId, portId]);
  return <div style={{ display: 'none' }} />;
};

Balance.propTypes = {
  args: PropTypes.string.isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Balance;
