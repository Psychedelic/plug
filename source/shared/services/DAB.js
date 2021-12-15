import { getTokens, getAllNFTS, getTokenActor } from '@psychedelic/dab-js';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

export const getDabTokens = async () => getTokens({});

export const getDabNfts = async () => getAllNFTS({});

export const getTokenBalance = async (token, user) => {
  const agent = new HttpAgent({
    host: 'https://mainnet.dfinity.network',
  });
  const tokenActor = await getTokenActor({
    canisterId: token.principal_id.toString(),
    agent,
    standard: token.standard,
  });
  const amount = await tokenActor.getBalance(
    user instanceof Principal ? user : Principal.fromText(user),
  );
  return amount;
};
