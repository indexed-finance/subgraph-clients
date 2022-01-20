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
  TOKEN_ADAPTERS_BY_TOKEN,
  ALL_VAULT_ACCOUNTS
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
  VaultReturnData,
  VaultAccount,
  VaultAccountReturnData,
} from './types'

export default class NirnSubgraphClient {
  constructor(public client: ApolloClient<unknown>) {}

  static forNetwork(network: 'rinkeby' | 'mainnet' | 'polygon') {
    const uri = SUBGRAPH_URLS[network].nirn;
    if (!uri) return undefined;
    const client = new ApolloClient({
      link: new HttpLink({ uri, fetch }),
      cache: new InMemoryCache(),
      shouldBatch: true,
    } as any);
    return new NirnSubgraphClient(client);
  }

  async getAllVaults(userAddress?: string): Promise<VaultData[]> {
    const vaults: VaultData[] = await this.client.query({
      query: ALL_VAULTS,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.registries[0].vaults.map(parseVault));
    if (userAddress) {
      const accounts = await this.getAllVaultAccounts(userAddress)
      accounts.forEach((account) => {
        const vault = vaults.find(v => v.id === account.vault);
        if (vault) {
          vault.averagePricePerShare = account.averagePricePerShare
        }
      })
    }
    return vaults
  }

  async allProtocolAdapters(): Promise<ProtocolAdapter[]> {
    return this.client.query({
      query: ALL_PROTOCOL_ADAPTERS,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.registries[0].protocolAdapters.map(parseProtocolAdapter));
  }

  async allTokenAdapters({first = 200, skip = 0}: { first: number; skip: number; } = {first: 200, skip: 0}): Promise<TokenAdapter[]> {
    return this.client.query({
      query: ALL_TOKEN_ADAPTERS,
      fetchPolicy: 'cache-first',
      variables: { first, skip }
    }).then((result) => result.data.registries[0].tokenAdapters.map(parseTokenAdapter));
  }

  async allSupportedTokens(): Promise<TokenData[]> {
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

  async getAllVaultAccounts(account: string): Promise<VaultAccount[]> {
    return this.client.query({
      query: ALL_VAULT_ACCOUNTS,
      fetchPolicy: 'cache-first',
      variables: { account: account.toLowerCase() },
    }).then((result) => result.data.vaultAccounts.map(parseVaultAccount));
  }
}

const parseVaultAccount = ({
  vault,
  averagePricePerShare,
  ...rest
}: VaultAccountReturnData): VaultAccount => ({
  vault: vault.id,
  averagePricePerShare: +averagePricePerShare,
  ...rest
})

const parseTokenData = ({ decimals, ...rest }: TokenReturnData): TokenData => ({
  ...rest,
  decimals: +decimals
})

const parseTokenAdapter = ({
  id,
  name,
  underlying,
  wrapper: { underlying: wU, ...wRest},
  protocol
}: TokenAdapterReturnData): TokenAdapter => ({
  id,
  name,
  underlying: parseTokenData(underlying),
  wrapper: { ...parseTokenData(wRest), underlying: wU.id },
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
  price,
  adaptersList,
  adapters,
  ...rest
}: VaultSnapshotReturnData): VaultSnapshot => ({
  timestamp: +timestamp,
  revenueAPRs: revenueAPRs.map(a => +a),
  weights: weights.map(w => +w),
  apr: +apr,
  price: +price,
  adapters: adaptersList.map((id) => parseTokenAdapter(adapters.find(a => a.id === id) as TokenAdapterReturnData)),
  ...rest
})

const parseVault = ({
  underlying,
  adapters,
  adaptersList,
  snapshots,
  decimals,
  reserveRatio,
  performanceFee,
  weights,
  price,
  ...rest
}: VaultReturnData): VaultData => ({
  decimals: +decimals,
  reserveRatio: +reserveRatio,
  performanceFee: +performanceFee,
  underlying: parseTokenData(underlying),
  adapters: adaptersList.map((id) => parseTokenAdapter(adapters.find(a => a.id === id) as TokenAdapterReturnData)),
  snapshots: snapshots.map(s => parseVaultSnapshot(s)),
  weights: weights.map(w => +w),
  price: +price,
  ...rest
})