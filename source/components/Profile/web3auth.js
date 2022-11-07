import { Web3AuthCore } from '@web3auth/core';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

const clientId = 'BCqXwJES36UmBnWzYhc4M69W35m2YMr2XVRhEX9bus5_GpeH0BTQrSxs5oBNvP5iAZxju7vJnufzeXs86iAM_bw';

export const web3auth = new Web3AuthCore({
  clientId,
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    displayName: 'Internet Computer',
    ticker: 'ICP',
    tickerName: 'icp',
  }, // 5 is the chainId for Goerli,
  enableLogging: false,
});

const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    network: 'testnet',
    uxMode: 'popup',
    clientId,
  },
});

web3auth.configureAdapter(openloginAdapter);
// call below code when user clicks on login button
// it will use google login with openlogin's authentication
export const web3AuthGoogleConnect = async () => web3auth.connectTo(
  'openlogin', { loginProvider: 'google' },
);

export const initWeb3Auth = async () => web3auth.init();

export const getPrivate = async () => web3auth.provider.request({
  method: 'private_key',
});
