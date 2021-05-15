import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-fetch'
import { SUBGRAPH_URLS } from '../constants'
import { 
  AllStakingInfoData,
  PoolData,
  AllStakingInfoReturnData,
  PoolReturnData
 } from './types';
import {
  ALL_STAKING_INFO
} from './queries';

const parsePool = ({
  decimals,
  allocPoint,
  lastRewardBlock,
  userCount,
  updatedAt,
  ...rest
}: PoolReturnData): PoolData => ({
  decimals: +decimals,
  allocPoint: +allocPoint,
  lastRewardBlock: +lastRewardBlock,
  userCount: +userCount,
  updatedAt: +updatedAt,
  ...rest
})

const parseStakingInfo = ({
  startBlock,
  endBlock,
  totalAllocPoint,
  poolCount,
  pools,
  ...rest
}: AllStakingInfoReturnData): AllStakingInfoData => ({
  startBlock: +startBlock,
  endBlock: +endBlock,
  totalAllocPoint: +totalAllocPoint,
  poolCount: +poolCount,
  pools: pools.map(parsePool),
  ...rest
})

export default class IndexedStakingSubgraphClient {
  constructor(public client: ApolloClient<unknown>) {}

  static forNetwork(network: 'rinkeby' | 'mainnet') {
    const client = new ApolloClient({
      link: new HttpLink({ uri: SUBGRAPH_URLS[network].indexedStaking, fetch }),
      cache: new InMemoryCache(),
      shouldBatch: true,
    } as any);
    return new IndexedStakingSubgraphClient(client);
  }

  async getStakingInfo(): Promise<AllStakingInfoData> {
    return this.client.query({
      query: ALL_STAKING_INFO,
      fetchPolicy: 'cache-first'
    }).then((result) => parseStakingInfo(result.data.multiTokenStakings[0]));
  }
}