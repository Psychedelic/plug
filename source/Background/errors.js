export const SILENT_ERRORS = {
  AGENT_REJECTED: { code: 401, message: 'The agent creation was rejected.' },
  SIGN_REJECTED: { code: 401, message: 'The signature was rejected.' },
  TRANSACTION_REJECTED: { code: 401, message: 'The transaction was rejected.' },
  UNAUTHORIZED_EXECUTION: { code: 401, message: 'Unauthorized call to provider executor' },
};

export default {
  CONNECTION_ERROR: {
    code: 401,
    message:
      'There was an error when this app/page tried to interact with your wallet in Plug. Please contact this project’s developers and share the error with them so they can fix it.',
  },
  CANISTER_NOT_WHITLESTED_ERROR: (canisterId) => ({
    code: 401,
    message: `This app tried to connect to a canister (${canisterId}) on your behalf without the proper permissions. Please contact this project’s developers and share the error with them so they can fix it.`,
  }),
  BALANCE_ERROR: {
    code: 400,
    message: 'The transaction that was just attempted failed because you don’t have enough funds. Review your balance before trying again, or contact the project’s developers.',
  },
  CANISTER_ID_ERROR: { code: 400, message: 'The transaction the app/page attempted failed because the destination Canister ID is invalid. Please contact this project’s developers so they can fix it.' },
  INITIALIZED_ERROR: { code: 403, message: 'This app tried to connect to Plug, but your wallet is not setup yet. Please click the extension and get started before trying to use an app.' },
  ICNS_ERROR: { code: 400, message: 'There was an error trying to fetch your ICNS information.' },
  CLIENT_ERROR: (message) => ({ code: 400, message }),
  SERVER_ERROR: (message) => ({ code: 500, message }),
  NOT_VALID_BATCH_TRANSACTION: {
    code: 401, message: 'The transaction that was just attempted failed because it was not a valid batch transaction. Please contact the project’s developers.',
  },
  SIZE_ERROR: { code: 400, message: "There isn't enough space to open the popup" },
  GET_BALANCE_ERROR: { code: 400, message: 'There was an error trying to fetch your balances.' },
  ...SILENT_ERRORS,
};
