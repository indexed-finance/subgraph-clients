import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-fetch'
import { SUBGRAPH_URLS } from '../constants'
import { 
  DailyPoolSnapshotPartialData,
  TokenData,
  PoolTokenData,
  IndexPoolData,
  IndexPoolUpdateData,
  DailyPoolSnapshotPartialReturnData,
  TokenReturnData,
  PoolTokenReturnData,
  IndexPoolReturnData,
  IndexPoolUpdateReturnData,
  NdxStakingPoolReturnData,
  NdxStakingPoolData,
 } from './types';
import {
  ALL_POOLS,
  POOL_BY_ID,
  POOL_SNAPSHOTS,
  POOL_UPDATE,
  STAKING_POOLS
} from './queries';
import {
  parseToken,
  parsePoolToken,
  parseDailySnapshot,
  parsePool,
  parseStakingPool,
} from './parsers'

export default class IndexedCoreSubgraphClient {
  constructor(public client: ApolloClient<unknown>) {}

  static forNetwork(network: 'rinkeby' | 'mainnet') {
    const client = new ApolloClient({
      link: new HttpLink({ uri: SUBGRAPH_URLS[network].indexedCore, fetch }),
      cache: new InMemoryCache(),
      shouldBatch: true,
    } as any);
    return new IndexedCoreSubgraphClient(client);
  }

  // Index Pools

  async getIndexPool(poolId: string): Promise<IndexPoolData> {
    return this.client.query({
      query: POOL_BY_ID,
      variables: { poolId: poolId.toLowerCase() },
      fetchPolicy: 'cache-first'
    }).then((result) => parsePool(result.data.indexPool));
  }

  async getAllIndexPools(): Promise<IndexPoolData[]> {
    return this.client.query({
      query: ALL_POOLS,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.indexPools.map(parsePool));
  }

  async getPoolUpdate(poolId: string): Promise<IndexPoolUpdateData> {
    return this.client.query({
      query: POOL_UPDATE,
      variables: { poolId: poolId.toLowerCase() },
      fetchPolicy: 'cache-first'
    }).then((result: { data: { indexPool: IndexPoolUpdateReturnData }}) => {
      const { dailySnapshots, tokens } = result.data.indexPool
      const snapshot = parseDailySnapshot(dailySnapshots[0]);
      const tokenPrices = tokens.reduce(
        (obj, t) => ({ ...obj, [t.token.id]: +(t.token.priceUSD) }),
        {}
      );
      return { snapshot, tokenPrices };
    });
  }

  async getPoolSnapshots(poolId: string, hours: number, chunkSize = 1000): Promise<DailyPoolSnapshotPartialData[]> {
    // const queries: string[] = [];
    const results: DailyPoolSnapshotPartialData[][] = [];
    let remainder = hours;
    let skip = 0;
    while (remainder > 0) {
      let num = Math.min(remainder, chunkSize);
      remainder -= num;
      results.push(await this.client.query({
        query: POOL_SNAPSHOTS,
        variables: {
          poolId: poolId.toLowerCase(),
          hours: num,
          skip
        },
        fetchPolicy: 'cache-first'
      }).then((result) => result.data.indexPool.dailySnapshots.map(parseDailySnapshot)))
      skip += num;
    }
    return results.reduce((arr, res) => ([ ...arr, ...res ]), [])
    // return this.client.query({
    //   query: POOL_SNAPSHOTS,
    //   variables: {
    //     poolId: poolId.toLowerCase(),
    //     hours
    //   },
    //   fetchPolicy: 'cache-first'
    // }).then((result) => result.data.indexPool.dailySnapshots.map(parseDailySnapshot));
  }

  // Staking Pools
  async getAllStakingPools(): Promise<NdxStakingPoolData[]> {
    return this.client.query({
      query: STAKING_POOLS,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.ndxStakingPools.map(parseStakingPool));
  }
}