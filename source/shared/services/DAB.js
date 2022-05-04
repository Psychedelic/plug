import { getTokens, getAllNFTS, getTokenActor } from '@psychedelic/dab-js';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { recursiveParseBigint } from '@background/Keyring';
import { recursiveParsePrincipal } from '@shared/utils/ids';

export const getDabTokens = async () => {
  const tokens = await getTokens({});
  const parsedTokens = (tokens || []).map(
    (token) => recursiveParseBigint(recursiveParsePrincipal(token)),
  );
  return parsedTokens.map((token) => ({ ...token, canisterId: token?.principal_id }));
};

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
