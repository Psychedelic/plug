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
    required: true,
    validate:
      (value, networks) => requiredValidation(value) || uniqueValidation(value, networks, 'name'),
  },
  host: {
    name: 'host',
    required: true,
    validate: (value, networks) => requiredValidation(value)
    || uniqueValidation(value, networks, 'host'),
  },
  ledgerCanisterId: {
    name: 'ledgerCanisterId',
    required: false,
    validate: canisterIdValidation,
  },
};
