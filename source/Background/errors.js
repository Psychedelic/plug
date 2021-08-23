export default {
  CONNECTION_ERROR: {
    code: 401,
    message:
      'You are not connected. You must call window.ic.plug.requestConnect() and have the user accept the popup before you call this method.',
  },
  BALANCE_ERROR: {
    code: 400,
    message: 'Insufficient balance or balance unavailable.',
  },
  CANISTER_ID_ERROR: { code: 400, message: 'Invalid canister id/s.' },
  TRANSACTION_REJECTED: {
    code: 401,
    message: 'The transactions was rejected.',
  },
  AGENT_REJECTED: { code: 401, message: 'The agent creation was rejected.' },
  INITIALIZED_ERROR: { code: 403, message: 'Plug must be initialized.' },
  CLIENT_ERROR: (message) => ({ code: 400, message }),
  SERVER_ERROR: (message) => ({ code: 500, message }),
};
