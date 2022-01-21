import gql from "graphql-tag";

export const ALL_STAKING_INFO = gql`
query allStakingInfo {
  ndxStakingPools(first: 20) {
    id
    indexPool
    stakingToken
    isWethPair
    startsAt
    periodFinish
    totalSupply
    lastUpdateTime
    totalRewards
    claimedRewards
    rewardRate
    rewardPerTokenStored
  }
}
`