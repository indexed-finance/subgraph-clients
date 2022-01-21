import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-fetch'
import { SUBGRAPH_URLS } from '../constants'
import { 
  OldStakingPoolData,
  OldStakingPoolReturnData
 } from './types';
import {
  ALL_STAKING_INFO
} from './queries';

const parseStakingInfo = ({
  rewardsDuration,
  periodFinish,
  startsAt,
  ...rest
}: OldStakingPoolReturnData): OldStakingPoolData => ({
  rewardsDuration: +rewardsDuration,
  periodFinish: +periodFinish,
  startsAt: +startsAt,
  ...rest
})

export default class OldStakingSubgraphClient {
  constructor(public client: ApolloClient<unknown>) {}
  static forNetwork(network: 'rinkeby' | 'mainnet' | 'polygon') {
    const uri = SUBGRAPH_URLS[network].oldStaking;
    if (!uri) return undefined;
    const client = new ApolloClient({
      link: new HttpLink({ uri, fetch }),
      cache: new InMemoryCache(),
      shouldBatch: true,
    } as any);
    return new OldStakingSubgraphClient(client);
  }

  async getStakingInfo(): Promise<OldStakingPoolData[]> {
    return this.client.query({
      query: ALL_STAKING_INFO,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.ndxStakingPools.map(parseStakingInfo));
  }
}