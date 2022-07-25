export const NETWORK_CREATION_DEFAULT_VALUES = { name: '', host: '', ledgerId: '' };
export const NETWORK_CREATION_FIELDS = {
  name: {
    name: 'name',
    placeholder: 'Enter a name for the network',
    required: true,
  },
  host: {
    name: 'host',
    placeholder: 'Enter the host of the network',
    required: true,
  },
  ledgerId: {
    name: 'ledgerId',
    placeholder: 'Enter the ledger canister ID of the network',
    required: false,
  },
};
