import gql from "graphql-tag";

export const ALL_STAKING_INFO = gql`
query allStakingInfo {
  multiTokenStakings(first: 1) {
    id
    owner
    rewardsSchedule
    startBlock
    endBlock
    rewardsToken
    totalAllocPoint
    poolCount
    pools(first: 100) {
      id
      token
      symbol
      name
      decimals
      balance
      isPairToken
      allocPoint
      lastRewardBlock
      userCount
      updatedAt
    }
  }
}
`