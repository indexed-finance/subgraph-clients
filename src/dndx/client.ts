import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-fetch'
import { SUBGRAPH_URLS } from '../constants'
import { DisbursalData, DisbursalReturnData, DNDXData, DNDXReturnData, TimeLockData, TimeLockReturnData } from "./types";
import { DNDX_DATA, LOCK_BY_ID, LOCKS_BY_OWNER } from './queries'

const parseDNDX = ({
  minLockDuration,
  maxLockDuration,
  numDisbursals,
  numLocks,
  ...rest
}: DNDXReturnData): DNDXData => ({
  minLockDuration: +minLockDuration,
  maxLockDuration: +maxLockDuration,
  numDisbursals: +numDisbursals,
  numLocks: +numLocks,
  ...rest
})

const parseDisbursal = ({
  disbursedAt,
  ...rest
}: DisbursalReturnData): DisbursalData => ({
  disbursedAt: +disbursedAt,
  ...rest
})

const parseLock = ({
  createdAt,
  duration,
  ...rest
}: TimeLockReturnData): TimeLockData => ({
  createdAt: +createdAt,
  duration: +duration,
  ...rest
})


export default class IndexedDividendsSubgraphClient {
  constructor(public client: ApolloClient<unknown>) {}

  static forNetwork(network: 'rinkeby' | 'mainnet') {
    const client = new ApolloClient({
      link: new HttpLink({ uri: SUBGRAPH_URLS[network].dndx, fetch }),
      cache: new InMemoryCache(),
      shouldBatch: true,
    } as any);
    return new IndexedDividendsSubgraphClient(client);
  }

  getData(): Promise<DNDXData> {
    return this.client.query({
      query: DNDX_DATA,
      fetchPolicy: 'cache-first'
    }).then((result) => parseDNDX(result.data.dndxs[0]));
  }

  getLock(id: string): Promise<TimeLockData> {
    return this.client.query({
      query: LOCK_BY_ID,
      variables: {
        lockId: id.toLowerCase()
      },
      fetchPolicy: 'cache-first'
    }).then((result) => parseLock(result.data.timeLock))
  }

  getLocksByOwner(owner: string): Promise<TimeLockData> {
    return this.client.query({
      query: LOCKS_BY_OWNER,
      variables: {
        owner: owner.toLowerCase()
      },
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.timeLocks.map(parseLock))
  }
}