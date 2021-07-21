import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PortRPC } from '@fleekhq/browser-rpc';

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const Balance = ({
  args: subaccount, metadata, callId, portId,
}) => {
  useEffect(async () => {
    if (metadata && callId && portId) {
      await portRPC.call('handleRequestBalance', [metadata.url, subaccount || 0, callId, portId]);
      window.close();
    }
  }, [metadata, subaccount, callId, portId]);
  return <div style={{ display: 'none' }} />;
};

Balance.propTypes = {
  args: PropTypes.string.isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Balance;
