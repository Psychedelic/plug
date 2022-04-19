import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import crossFetch from 'cross-fetch';
import resolverIDL from '../utils/ic/icns/resolver.did';
import registryIDL from '../utils/ic/icns/registry.did';

const ICNS_REGISTRY_ID = 'e5kvl-zyaaa-aaaan-qabaq-cai';
const ICNS_RESOLVER_ID = 'euj6x-pqaaa-aaaan-qabba-cai';
const DEFAULT_AGENT = new HttpAgent({ fetch: crossFetch, host: 'https://ic0.app' });
const ICNS_IMG = 'https://icns.id/Rectangle.jpg';
export const ICNS_LOGO = 'https://icns.id/ICNS-logo.png';

const Resolver = Actor.createActor(resolverIDL, {
  canisterId: ICNS_RESOLVER_ID,
  agent: DEFAULT_AGENT,
});

const Registry = Actor.createActor(registryIDL, {
  canisterId: ICNS_REGISTRY_ID,
  agent: DEFAULT_AGENT,
});

/* Resolution rules:
 * 1. If it's ICP
 *    - If the returned Record has an account, return the account
 *    - If not, if the returned Record has a pid, return the pid
 *    - If not, fetch the record from the Registry and return the owner's pid.
 *
 * 2. If it's not ICP:
 *    - If the returned Record has a pid, return the pid
 *    - If not, fetch the record from the Registry and return the owner's pid.
 */
export const resolveName = async (name, isICP) => {
  let record = await Resolver.getUserDefaultInfo(name);
  const { icp, pid: principal } = record?.[0] || {};
  const accountId = icp?.[0];
  if (isICP && accountId) {
    return accountId;
  }
  if (!principal) {
    record = await Registry.getRecord(name);
    const { owner } = record?.[0] || {};
    return owner?.toString?.();
  }
  return principal?.toString?.();
};

/* Gets all names owned by a principal */
export const getNamesForPrincipal = async (principalId, raw) => {
  let icnsNames = await Registry.getUserDomains(Principal.from(principalId));
  icnsNames = [...icnsNames[0], { name: 'somelongname.icp' }, { name: 'rollsmor.icp' }];
  return raw ? icnsNames : icnsNames?.map((icns) => icns?.name);
};

export const formatICNSNamesAsNFTs = (icnsNames = []) => icnsNames.map(
  (icns) => ({
    name: icns, url: ICNS_IMG, collection: 'ICNS', desc: 'ICNS Name Record', canister: ICNS_REGISTRY_ID,
  }),
);

export const formatICNSCollection = (icnsNames = []) => ({
  canisterId: ICNS_REGISTRY_ID,
  description: 'ICNS .icp names',
  icon: ICNS_LOGO,
  name: 'ICNS',
  standard: 'DIP721',
  tokens: formatICNSNamesAsNFTs(icnsNames),
});
