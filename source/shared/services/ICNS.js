import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import crossFetch from 'cross-fetch';
import resolverIDL from '../utils/ic/icns/resolver.did';
import registryIDL from '../utils/ic/icns/registry.did';
import shortAddress from '@shared/utils/short-address';

const ICNS_REGISTRY_ID = 'e5kvl-zyaaa-aaaan-qabaq-cai';
const ICNS_RESOLVER_ID = 'euj6x-pqaaa-aaaan-qabba-cai';
const DEFAULT_AGENT = new HttpAgent({ fetch: crossFetch, host: 'https://ic0.app' });
export const shortICNSName = (name) => shortAddress(name, 3, 5);

export const ICNS_IMG = 'https://icns.id/Rectangle.jpg'; // TODO: Change this to proper img
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

