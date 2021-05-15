import gql from 'graphql-tag'

const dailySnapshotPartialBody = `
id
date
value
totalSupply
feesTotalUSD
totalValueLockedUSD
totalSwapVolumeUSD
totalVolumeUSD
`

const indexPoolPartialBody = `
id
category {
  id
}
size
name
symbol
isPublic
totalSupply
totalWeight
swapFee
exitFee
feesTotalUSD
totalValueLockedUSD
totalVolumeUSD
totalSwapVolumeUSD
tokensList
poolInitializer {
  id
  totalCreditedWETH
  tokens {
    token {
      id
      decimals
      name
      symbol
      priceUSD
    }
    balance
    targetBalance
    amountRemaining
  }
}
tokens {
  id
  token {
    id
    decimals
    name
    symbol
    priceUSD
  }
  ready
  balance
  minimumBalance
  denorm
  desiredDenorm
}
dailySnapshots(orderBy: date, orderDirection: desc, first: 168) {
  ${dailySnapshotPartialBody}
}
`;

export const POOL_BY_ID = gql`
query poolById($poolId: Bytes!) {
  indexPool(id: $poolId) {
    ${indexPoolPartialBody}
  }
}
`

export const ALL_POOLS = gql`
query allPools {
  indexPools(first: 100) {
    ${indexPoolPartialBody}
  }
}
`

export const TOKEN_DAYS_DATA = gql`
query tokenDayData($tokenId: Bytes!, $days: Int!) {
  tokenDayDatas(
    orderBy: date,
    orderDirection: desc,
    first: $days,
    where: { token: $tokenId }
  ) {
    date
    priceUSD
  }
}
`

export const POOL_SNAPSHOTS = gql`
query snapshots($poolId: Bytes!, $hours: Int!) {
  indexPool(id: $poolId) {
    dailySnapshots(orderBy: date, orderDirection: desc, first: $hours) {
      ${dailySnapshotPartialBody}
    }
  }
}
`

export const STAKING_POOLS = gql`
query stakingPools {
  ndxStakingPools(first: 100) {
    id
    isWethPair
    startsAt
		isReady
    indexPool
    stakingToken
    totalSupply
    periodFinish
    lastUpdateTime
    totalRewards
    claimedRewards
    rewardRate
    rewardPerTokenStored
  }
}
`

export const POOL_UPDATE = gql`
query lastHourPoolData($poolId: Bytes!) {
  indexPool(id: $poolId) {
    dailySnapshots(orderBy: date, orderDirection: desc, first: 1) {
      ${dailySnapshotPartialBody}
    }
    tokens {
      token {
        id
        priceUSD
      }
    }
  }
}
`