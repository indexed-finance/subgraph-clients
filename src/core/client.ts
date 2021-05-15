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

const parseToken = (token: TokenReturnData): TokenData => ({
  ...token,
  decimals: +token.decimals,
  priceUSD: +token.priceUSD
})

const parsePoolToken = ({
  token,
  ...rest
}: PoolTokenReturnData): PoolTokenData => ({
  ...rest,
  token: parseToken(token)
})

const parseDailySnapshot = ({
  date,
  value,
  feesTotalUSD,
  totalValueLockedUSD,
  totalSwapVolumeUSD,
  totalVolumeUSD,
  dailyFeesUSD,
  dailySwapVolumeUSD,
  ...rest
}: DailyPoolSnapshotPartialReturnData): DailyPoolSnapshotPartialData => ({
  ...rest,
  date: +date,
  value: +value,
  feesTotalUSD: +feesTotalUSD,
  totalValueLockedUSD: +totalValueLockedUSD,
  totalSwapVolumeUSD: +totalSwapVolumeUSD,
  totalVolumeUSD: +totalVolumeUSD,
  dailyFeesUSD: +dailyFeesUSD,
  dailySwapVolumeUSD: +dailySwapVolumeUSD
})

const parsePool = ({
  size,
  swapFee,
  exitFee,
  feesTotalUSD,
  totalValueLockedUSD,
  totalVolumeUSD,
  totalSwapVolumeUSD,
  dailySnapshots,
  tokens,
  poolInitializer,
  ...rest
}: IndexPoolReturnData): IndexPoolData => ({
  ...rest,
  size: +size,
  swapFee: +swapFee,
  exitFee: +exitFee,
  feesTotalUSD: +feesTotalUSD,
  totalValueLockedUSD: +totalValueLockedUSD,
  totalVolumeUSD: +totalVolumeUSD,
  totalSwapVolumeUSD: +totalSwapVolumeUSD,
  poolInitializer: {
    ...poolInitializer,
    tokens: poolInitializer.tokens.map(({ token, ...tokenRest }) => ({
      ...tokenRest,
      token: parseToken(token)
    }))
  },
  tokens: tokens.map(parsePoolToken),
  dailySnapshots: dailySnapshots.map(parseDailySnapshot)
})

const parseStakingPool = ({
  startsAt,
  periodFinish,
  lastUpdateTime,
  ...rest
}: NdxStakingPoolReturnData): NdxStakingPoolData => ({
  ...rest,
  startsAt: +startsAt,
  periodFinish: +periodFinish,
  lastUpdateTime: +lastUpdateTime,
})

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

  async getPoolSnapshots(poolId: string, hours: number): Promise<DailyPoolSnapshotPartialData[]> {
    return this.client.query({
      query: POOL_SNAPSHOTS,
      variables: {
        poolId: poolId.toLowerCase(),
        hours
      },
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.indexPool.dailySnapshots.map(parseDailySnapshot));
  }

  // Staking Pools
  async getAllStakingPools(): Promise<NdxStakingPoolData[]> {
    return this.client.query({
      query: STAKING_POOLS,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.ndxStakingPools.map(parseStakingPool));
  }
}