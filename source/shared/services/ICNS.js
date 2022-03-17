import { Actor, HttpAgent } from '@dfinity/agent';
import crossFetch from 'cross-fetch';
import resolverIDL from '../utils/ic/icns/resolver.did';
import registryIDL from '../utils/ic/icns/registry.did';

const ICNS_REGISTRY_ID = 'e5kvl-zyaaa-aaaan-qabaq-cai';
const ICNS_RESOLVER_ID = 'euj6x-pqaaa-aaaan-qabba-cai';
const DEFAULT_AGENT = new HttpAgent({ fetch: crossFetch, host: 'https://ic0.app' });

const Resolver = Actor.createActor(resolverIDL, {
  canisterId: ICNS_RESOLVER_ID,
  agent: DEFAULT_AGENT,
});

const Registry = Actor.createActor(registryIDL, {
  canisterId: ICNS_REGISTRY_ID,
  agent: DEFAULT_AGENT,
});

export default async (name, isICP) => {
  const key = isICP ? 'icp' : 'pid';
  let response = await Resolver.getUserDefaultInfo(name);
  let value = response?.[0]?.[key]?.toString?.();
  if (!value) {
    response = await Registry.getRecord(name);
    value = response?.[0]?.controller?.toString?.();
  }
  console.log('Resolver response', value);
  return value;
};
