import gql from "graphql-tag";

const tokenAdapterQueryBody = `
id
name
underlying {
  id
  symbol
  name
  decimals
}
wrapper {
  id
  symbol
  name
  decimals
  underlying { id }
}
protocol {
  id
  address
  name
}
`

export const ALL_VAULTS = gql`
query allVaults {
  registries(first: 1) {
    id
    vaults(first: 100) {
      id
      symbol
      name
      decimals
      totalFeesClaimed
      underlying {
        id
        symbol
        name
        decimals
      }
      feeRecipient
      rewardsSeller
      performanceFee
      reserveRatio
      price
      adaptersList
      adapters {
        ${tokenAdapterQueryBody}
      }
      weights
      snapshots(first: 100) {
        id
        timestamp
        type
        totalValue
        totalFeesClaimed
        revenueTokens
        revenueAPRs
        adaptersList
        adapters {
          ${tokenAdapterQueryBody}
        }
        weights
        apr
        price
      }
    }
  }
}
`

export const ALL_VAULT_ACCOUNTS = gql`
query allVaultAccounts($account: Bytes!) {
  vaultAccounts(first: 100, where: {account: $account}) {
    id
    account
    vault {
      id
    }
    averagePricePerShare
  }
}
`

export const ALL_PROTOCOL_ADAPTERS = gql`
query allProtocolAdapters {
  registries(first: 1) {
    id
    protocolAdapters(first: 100) {
      id
      address
      name
      tokenAdaptersCount
    }
  }
}
`

export const ALL_TOKEN_ADAPTERS = gql`
query allTokenAdapters($first: Int!, $skip: Int!) {
  registries(first: 1) {
    id
    tokenAdapters(first: $first, skip: $skip) {
      ${tokenAdapterQueryBody}
    }
  }
}
`

export const ALL_SUPPORTED_TOKENS = gql`
query allSupportedTokens {
  registries(first: 1) {
    id
    supportedTokens(first: 100) {
      id
      symbol
      name
      decimals
    }
  }
}
`

export const TOKEN_ADAPTERS_BY_PROTOCOL = gql`
query tokenAdaptersByProtocol($id: Bytes!) {
  registries(first: 1) {
    id
    tokenAdapters(first: 100, where: { protocol: $id }) {
      ${tokenAdapterQueryBody}
    }
  }
}
`

export const TOKEN_ADAPTERS_BY_TOKEN = gql`
query tokenAdaptersByToken($id: Bytes!) {
  registries(first: 1) {
    id
    tokenAdapters(first: 100, where: { underlying: $id }) {
      ${tokenAdapterQueryBody}
    }
  }
}
`