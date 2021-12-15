import { getTokens, getAllNFTS, getTokenActor } from '@psychedelic/dab-js';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

export const getDabTokensWithBalance = async (user) => {
  const agent = new HttpAgent({
    host: 'https://mainnet.dfinity.network',
  });
  const tokens = await getTokens({});
  return tokens.map(async (token) => {
    const tokenActor = await getTokenActor({
      canisterId: token.principal_id.toString(), agent, standard: token.standard,
    });
    const amount = await tokenActor.getBalance(
      user instanceof Principal ? user : Principal.fromText(user),
    );
    return { ...token, amount };
  });
};
export const getDabNfts = async () => getAllNFTS({});
