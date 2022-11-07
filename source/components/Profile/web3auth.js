import { Web3AuthCore } from '@web3auth/core';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

const web3authCore = new Web3AuthCore({
  chainConfig: { // this is ethereum chain config, change if other chain(Solana, Polygon)
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x1',
    rpcTarget: 'https://mainnet.infura.io/v3/776218ac4734478c90191dde8cae483c',
    blockExplorer: 'https://etherscan.io/',
    ticker: 'ETH',
    tickerName: 'Ethereum',
  },
});
const adapter = new OpenloginAdapter({
  adapterSettings: {
    network: 'testnet',
    clientId: 'Your clientId from Plug n play section',
    uxMode: 'redirect', // other option: popup
    loginConfig: {
      google: {
        name: 'any name',
        verifier: 'plug-google-verifier',
        typeOfLogin: 'google',
        clientId: '956770934132-2660637tqliurjai2f1cbdum3rm31tit.apps.googleusercontent.com',

      },
    },
  },
});
web3authCore.configureAdapter(adapter);

// call below code when user clicks on login button
// it will use google login with openlogin's authentication
export const web3AuthGoogleConnect = async () => web3authCore.connectTo(
  adapter.name, { loginProvider: 'google' },
);

export const initWeb3Auth = async () => web3authCore.init();
