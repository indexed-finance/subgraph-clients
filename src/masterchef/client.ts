import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-fetch'
import { SUBGRAPH_URLS } from '../constants'
import { 
  AllMasterChefData,
  MasterChefPoolData,
  AllMasterChefReturnData,
  MasterChefPoolReturnData
 } from './types';
import {
  ALL_STAKING_INFO
} from './queries';

const parsePool = ({
  allocPoint,
  lastRewardBlock,
  userCount,
  updatedAt,
  pair,
  ...rest
}: MasterChefPoolReturnData): MasterChefPoolData => ({
  allocPoint: +allocPoint,
  lastRewardBlock: +lastRewardBlock,
  userCount: +userCount,
  updatedAt: +updatedAt,
  token: pair,
  ...rest
})

const parseStakingInfo = ({
  startBlock,
  totalAllocPoint,
  poolCount,
  pools,
  ...rest
}: AllMasterChefReturnData): AllMasterChefData => ({
  startBlock: +startBlock,
  totalAllocPoint: +totalAllocPoint,
  poolCount: +poolCount,
  pools: pools.map(parsePool),
  ...rest
})

export default class MasterChefSubgraphClient {
  constructor(public client: ApolloClient<unknown>) {}

  static forNetwork(network: 'rinkeby' | 'mainnet' | 'polygon') {
    const uri = SUBGRAPH_URLS[network].masterChef;
    if (!uri) return undefined;
    const client = new ApolloClient({
      link: new HttpLink({ uri, fetch }),
      cache: new InMemoryCache(),
      shouldBatch: true,
    } as any);
    return new MasterChefSubgraphClient(client);
  }

  async getStakingInfo(): Promise<AllMasterChefData> {
    return this.client.query({
      query: ALL_STAKING_INFO,
      fetchPolicy: 'cache-first'
    }).then((result) => parseStakingInfo(result.data.masterChefs[0]));
  }
}