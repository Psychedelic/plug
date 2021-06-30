export const HANDLER_TYPES = {
  LOCK: 'lock-keyring',
  UNLOCK: 'unlock-keyring',
  CREATE: 'create-keyring',
  IMPORT: 'import-keyring',
  GET: 'get-keyring',
  GET_STATE: 'get-keyring-state',
  GET_TRANSACTIONS: 'get-keyring-transactions',
};

export const getKeyringHandler = (type, keyring) => ({
  [HANDLER_TYPES.LOCK]: async () => keyring.lock(),
  [HANDLER_TYPES.UNLOCK]: async (params) => {
    let unlocked = false;
    try {
      unlocked = await keyring.unlock(params?.password);
    } catch (e) {
      unlocked = false;
    }
    return unlocked;
  },
  [HANDLER_TYPES.CREATE]: async (params) => keyring.create({ ...params }),
  [HANDLER_TYPES.IMPORT]: async (params) => keyring.importMnemonic({ ...params }),
  [HANDLER_TYPES.GET]: () => keyring,
  [HANDLER_TYPES.GET_STATE]: async () => keyring.getState(),
  [HANDLER_TYPES.GET_TRANSACTIONS]: async () => keyring.transactions,
})[type];
