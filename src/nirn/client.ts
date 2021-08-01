import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-fetch'
import { SUBGRAPH_URLS } from '../constants'
import {
  ALL_VAULTS,
  ALL_PROTOCOL_ADAPTERS,
  ALL_TOKEN_ADAPTERS,
  ALL_SUPPORTED_TOKENS,
  TOKEN_ADAPTERS_BY_PROTOCOL,
  TOKEN_ADAPTERS_BY_TOKEN
} from './queries'
import {
  TokenData,
  TokenReturnData,
  TokenAdapter,
  TokenAdapterReturnData,
  ProtocolAdapterReturnData,
  ProtocolAdapter,
  VaultSnapshot,
  VaultSnapshotReturnData,
  VaultData,
  VaultReturnData
} from './types'

export default class NirnSubgraphClient {
  constructor(public client: ApolloClient<unknown>) {}

  static forNetwork(network: 'rinkeby' | 'mainnet') {
    const client = new ApolloClient({
      link: new HttpLink({ uri: SUBGRAPH_URLS[network].indexedCore, fetch }),
      cache: new InMemoryCache(),
      shouldBatch: true,
    } as any);
    return new NirnSubgraphClient(client);
  }

  async getAllVaults(): Promise<VaultData[]> {
    return this.client.query({
      query: ALL_VAULTS,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.registries[0].vaults.map(parseVault));
  }

  async allProtocolAdapters(): Promise<ProtocolAdapter[]> {
    return this.client.query({
      query: ALL_PROTOCOL_ADAPTERS,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.registries[0].protocolAdapters.map(parseProtocolAdapter));
  }

  async allTokenAdapters(): Promise<TokenAdapter[]> {
    return this.client.query({
      query: ALL_TOKEN_ADAPTERS,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.registries[0].tokenAdapters.map(parseTokenAdapter));
  }

  async allSupportedTokens(): Promise<TokenAdapter[]> {
    return this.client.query({
      query: ALL_SUPPORTED_TOKENS,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.registries[0].supportedTokens.map(parseTokenData));
  }

  async getTokenAdaptersByProtocol(protocolId: string): Promise<TokenAdapter[]> {
    return this.client.query({
      query: TOKEN_ADAPTERS_BY_PROTOCOL,
      fetchPolicy: 'cache-first',
      variables: { id: protocolId.toLowerCase() },
    }).then((result) => result.data.registries[0].tokenAdapters.map(parseTokenAdapter));
  }

  async getTokenAdaptersByUnderlying(underlying: string): Promise<TokenAdapter[]> {
    return this.client.query({
      query: TOKEN_ADAPTERS_BY_TOKEN,
      fetchPolicy: 'cache-first',
      variables: { id: underlying.toLowerCase() },
    }).then((result) => result.data.registries[0].tokenAdapters.map(parseTokenAdapter));
  }
}

const parseTokenData = ({ decimals, ...rest }: TokenReturnData): TokenData => ({
  ...rest,
  decimals: +decimals
})

const parseTokenAdapter = ({
  id,
  name,
  underlying,
  wrapper,
  protocol
}: TokenAdapterReturnData): TokenAdapter => ({
  id,
  name,
  underlying: parseTokenData(underlying),
  wrapper: parseTokenData(wrapper),
  protocol
})

const parseProtocolAdapter = ({
  tokenAdaptersCount,
  ...rest
}: ProtocolAdapterReturnData): ProtocolAdapter => ({
  ...rest,
  tokenAdaptersCount: +tokenAdaptersCount
})

const parseVaultSnapshot = ({
  timestamp,
  revenueAPRs,
  weights,
  apr,
  ...rest
}: VaultSnapshotReturnData): VaultSnapshot => ({
  timestamp: +timestamp,
  revenueAPRs: revenueAPRs.map(a => +a),
  weights: weights.map(w => +w),
  apr: +apr,
  ...rest
})

const parseVault = ({
  underlying,
  adapters,
  snapshots,
  decimals,
  reserveRatio,
  performanceFee,
  weights,
  ...rest
}: VaultReturnData): VaultData => ({
  decimals: +decimals,
  reserveRatio: +reserveRatio,
  performanceFee: +performanceFee,
  underlying: parseTokenData(underlying),
  adapters: adapters.map(a => parseTokenAdapter(a)),
  snapshots: snapshots.map(s => parseVaultSnapshot(s)),
  weights: weights.map(w => +w),
  ...rest
})