/* eslint-disable no-console */
import { Actor, HttpAgent } from '@dfinity/agent';
import crossFetch from 'cross-fetch';

import shortAddress from '@shared/utils/short-address';

import { Principal } from '@dfinity/principal';
import resolverIDL from '../utils/ic/icns/resolver.did';
import registryIDL from '../utils/ic/icns/registry.did';
import ReverseRegistrarIDL from '../utils/ic/icns/reverse_registrar.did';

const ICNS_REGISTRY_ID = 'e5kvl-zyaaa-aaaan-qabaq-cai';
const ICNS_RESOLVER_ID = 'euj6x-pqaaa-aaaan-qabba-cai';
const ICNS_REVERSE_REGISTRAR_ID = 'etiyd-ciaaa-aaaan-qabbq-cai';
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

const ReverseRegistrar = Actor.createActor(ReverseRegistrarIDL, {
  canisterId: ICNS_REVERSE_REGISTRAR_ID,
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
  try {
    let record = await Resolver.getUserDefaultInfo(name);
    const { icp, pid: principal } = record?.[0] || {};
    const accountId = icp?.[0];
    if (isICP && accountId) {
      return accountId;
    }
    if (!principal || !principal.length) {
      record = await Registry.getRecord(name);
      const { owner } = record?.[0] || {};
      return owner?.toString?.();
    }
    return Array.isArray(principal) ? principal?.[0]?.toString() : principal?.toString?.();
  } catch (e) {
    console.warn('Error resolving the ICNS', e);
    return null;
  }
};

export const getReverseResolvedName = async (principal) => {
  try {
    const name = await ReverseRegistrar.getName(Principal.fromText(principal));
    return name?.toString?.();
  } catch (e) {
    console.warn('Failed to get reverse resolved name', e); // eslint-disable-line no-console
    return null;
  }
};

export const getMultipleReverseResolvedNames = async (principals) => {
  const names = {};
  await Promise.all(principals.map(async (pid) => {
    const name = await getReverseResolvedName(pid);
    names[pid] = name;
  }));
  return names;
};
