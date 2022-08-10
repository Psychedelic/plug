import { validateCanisterId } from '@shared/utils/ids';
import { isValidUrl } from '@shared/utils/string';

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

const urlValidation = (value) => !isValidUrl(value) && 'Invalid URL';

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
    || uniqueValidation(value, networks, 'host')
    || urlValidation(value),
  },
  ledgerCanisterId: {
    name: 'ledgerCanisterId',
    required: false,
    validate: canisterIdValidation,
  },
};
