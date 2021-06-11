import gql from "graphql-tag";

export const ALL_STAKING_INFO = gql`
query allStakingInfo {
  masterChefs(first: 1) {
    id
    owner
    startBlock
    sushiPerBlock
    totalAllocPoint
    poolCount
    pools(first: 500) {
      id
      pair
      balance
      allocPoint
      lastRewardBlock
      userCount
      updatedAt
    }
  }
}
`