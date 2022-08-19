import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PortRPC } from '@psychedelic/browser-rpc';
import { reviewPendingTransaction } from '@modules/storageManager';

const portRPC = new PortRPC({
  name: 'notification-port',
  target: 'bg-script',
  timeout: 20000,
});

portRPC.start();

const LoginProxy = ({
  args, metadata, callId, portId, handler, transactionId,
}) => {
  useEffect(async () => {
    if (metadata && callId && portId) {
      reviewPendingTransaction(transactionId, async () => {});
      await portRPC.call(handler, [metadata.url, args || {}, callId, portId, transactionId]);
      window.close();
    }
  }, [handler, metadata, args, callId, portId]);
  return <div style={{ display: 'none' }} />;
};

LoginProxy.propTypes = {
  args: PropTypes.string.isRequired,
  handler: PropTypes.string.isRequired,
  callId: PropTypes.string.isRequired,
  portId: PropTypes.string.isRequired,
  metadata: PropTypes.objectOf(PropTypes.string).isRequired,
  transactionId: PropTypes.string.isRequired,
};

export default LoginProxy;
