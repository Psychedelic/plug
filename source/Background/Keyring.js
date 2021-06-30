export default (type, keyring) => ({
  'lock-keyring': async () => keyring.lock(),
  'unlock-keyring': async (params) => {
    let unlocked = false;
    try {
      unlocked = await keyring.unlock(params?.password);
    } catch (e) {
      unlocked = false;
    }
    return unlocked;
  },
  'create-keyring': async (params) => keyring.create({ ...params }),
  'import-keyring': async (params) => keyring.importMnemonic({ ...params }),
  'get-keyring': () => keyring,
  'get-keyring-state': async () => keyring.getState(),
  'get-keyring-transactions': async () => keyring.transactions,
})[type];
