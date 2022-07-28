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

// Validates that the string is a valid https url
const httpsHostValidation = (value) => {
  const url = new URL(value);
  return (url.protocol === 'http:') ? null : 'The host must be a valid https url';
};

export const NETWORK_CREATION_DEFAULT_VALUES = {
  name: {
    value: '',
    error: null,
  },
  host: {
    value: '',
    error: null,
  },
  ledgerCanisterId: {
    value: '',
    error: null,
  },
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
    || uniqueValidation(value, networks, 'host')
    || httpsHostValidation(value),
  },
  ledgerCanisterId: {
    name: 'ledgerCanisterId',
    placeholder: 'Enter the ledger canister ID of the network',
    required: false,
    validate: canisterIdValidation,
  },
};
