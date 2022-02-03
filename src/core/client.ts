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
  PoolSwapData,
  PoolSwapReturnData,
 } from './types';
import {
  ALL_POOLS,
  POOL_BY_ID,
  POOL_SNAPSHOTS,
  POOL_SWAPS_BULK,
  POOL_UPDATE,
  POOL_UPDATE_BULK,
  STAKING_POOLS
} from './queries';
import {
  parseToken,
  parsePoolToken,
  parseDailySnapshot,
  parsePool,
  parseStakingPool,
  parsePoolSwapData,
  parseIndexPoolUpdate
} from './parsers'

export default class IndexedCoreSubgraphClient {
  constructor(public client: ApolloClient<unknown>) {}

  static forNetwork(network: 'rinkeby' | 'mainnet' | 'polygon') {
    const uri = SUBGRAPH_URLS[network].indexedCore;
    if (!uri) return undefined;
    const client = new ApolloClient({
      link: new HttpLink({ uri, fetch }),
      cache: new InMemoryCache(),
      shouldBatch: true,
    } as any);
    return new IndexedCoreSubgraphClient(client);
  }

  // Index Pools

  async getSwaps(pools: string[], numSwaps: number = 10): Promise<Record<string, PoolSwapData[]>> {
    return this.client.query({
      query: POOL_SWAPS_BULK(pools.map(p => p.toLowerCase()), numSwaps),
      fetchPolicy: 'cache-first',
    }).then((result) => {
      const retData = result.data as Record<string, PoolSwapReturnData[]>;
      const parsed: Record<string, PoolSwapData[]> = {};
      for (const pool of pools) {
        parsed[pool] = retData[`q_${pool.toLowerCase()}`].map(parsePoolSwapData)
      }
      return parsed
    });
  }

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
      return parseIndexPoolUpdate(result.data.indexPool)
    });
  }

  async getPoolUpdates(poolIds: string[]): Promise<Record<string, IndexPoolUpdateData>> {
    return this.client.query({
      query: POOL_UPDATE_BULK(poolIds.map(p => p.toLowerCase())),
      fetchPolicy: 'cache-first'
    }).then((result) => {
      const retData = result.data as Record<string, IndexPoolUpdateReturnData>;
      const parsed: Record<string, IndexPoolUpdateData> = {};
      for (const pool of poolIds) {
        parsed[pool] = parseIndexPoolUpdate(retData[`q_${pool.toLowerCase()}`])
      }
      return parsed
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
  }

  // Staking Pools
  async getAllStakingPools(): Promise<NdxStakingPoolData[]> {
    return this.client.query({
      query: STAKING_POOLS,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.ndxStakingPools.map(parseStakingPool));
  }
}