import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PortRPC } from '@fleekhq/browser-rpc';

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const Principal = ({
  metadata, callId, portId,
}) => {
  useEffect(async () => {
    if (metadata && callId && portId) {
      await portRPC.call('handleGetPrincipal', [metadata.url, callId, portId]);
      window.close();
    }
  }, [metadata, callId, portId]);
  return <div style={{ display: 'none' }} />;
};

Principal.propTypes = {
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Principal;
