import { validateCanisterId } from '@shared/utils/ids';

const requiredValidation = (value) => (!value?.length && 'Required') || null;
const uniqueValidation = (value, networks, field) => (networks?.find((net) => net[field] === value)
  && `There is already a network with that ${field}`)
  || null;
const canisterIdValidation = (value) => {
  if (!value?.length || validateCanisterId(value)) {
    return null;
  }
  return 'Invalid canister ID';
};

export const NETWORK_CREATION_DEFAULT_VALUES = {
  name: '',
  host: '',
  ledgerCanisterId: '',
};
export const NETWORK_CREATION_FIELDS = {
  name: {
    name: 'name',
    placeholder: 'Enter a name for the network',
    required: true,
    validate:
      (value, networks) => requiredValidation(value) || uniqueValidation(value, networks, 'name'),
  },
  host: {
    name: 'host',
    placeholder: 'Enter the host of the network',
    required: true,
    validate: (value, networks) => requiredValidation(value)
    || uniqueValidation(value, networks, 'host'),
  },
  ledgerCanisterId: {
    name: 'ledgerCanisterId',
    placeholder: 'Enter the ledger canister ID of the network',
    required: false,
    validate: canisterIdValidation,
  },
};
