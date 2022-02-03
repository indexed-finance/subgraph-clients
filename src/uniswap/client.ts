import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-fetch'
import { PairSwapData, PairSwapReturnData } from "./types";
import { SUBGRAPH_URLS } from '../constants';
import { PAIR_SWAPS_BULK } from './queries';

export const parseSwapData = ({
  amount0In,
  amount1In,
  amount0Out,
  amount1Out,
  amountUSD,
  timestamp,
  ...rest
}: PairSwapReturnData): PairSwapData => ({
  amount0In: +amount0In,
  amount1In: +amount1In,
  amount0Out: +amount0Out,
  amount1Out: +amount1Out,
  amountUSD: +amountUSD,
  timestamp: +timestamp,
  ...rest
})

export default class UniswapSubgraphClient {
  constructor(public client: ApolloClient<unknown>) {}

  static forNetwork(network: 'rinkeby' | 'mainnet' | 'polygon') {
    const uri = SUBGRAPH_URLS[network].uniswap;
    if (!uri) return undefined;
    const client = new ApolloClient({
      link: new HttpLink({ uri, fetch }),
      cache: new InMemoryCache(),
      shouldBatch: true,
    } as any);
    return new UniswapSubgraphClient(client);
  }

  async getSwaps(pairs: string[], numSwaps: number = 10): Promise<Record<string, PairSwapData[]>> {
    return this.client.query({
      query: PAIR_SWAPS_BULK(pairs.map(p => p.toLowerCase()), numSwaps),
      fetchPolicy: 'cache-first',
    }).then((result) => {
      const retData = result.data as Record<string, PairSwapReturnData[]>;
      const parsed: Record<string, PairSwapData[]> = {};
      for (const pair of pairs) {
        parsed[pair] = retData[`q_${pair.toLowerCase()}`].map(parseSwapData)
      }
      return parsed
    });
  }
}