export const getOptsData = (opts) => ({
  callId: opts.message.data.data,
  portId: opts.sender,
  callback: opts.callback,
});

export const handleError = ({
  value = false,
  callback,
  error,
  portId,
  callId
}) => {
  callback(null, value);
  callback(error, null, [{ portId, callId }]);
};

export const handleSuccess = ({
  callback,
  response,
  portId,
  callId
}) => {
  callback(null, true);
  callback(null, response, [{ portId, callId }]);
};

