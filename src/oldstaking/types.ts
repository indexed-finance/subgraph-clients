export type OldStakingPoolData = {
  id: string; // Staking pool address
  rewardsDuration: number;
  periodFinish: number;
  rewardRate: string;
  rewardPerTokenStored: string;
  totalSupply: string; // Total amount of tokens staked
  stakingToken: string; // Address of token being staked
  indexPool: string; // Address of related index pool
  isWethPair: boolean; // Whether the pool is for a UNI LP pair
  /** Unix timestamp for when staking pool begins */
  startsAt: number;
  totalRewards: string;
}

// Raw Types

export type OldStakingPoolReturnData = {
  id: string; // Staking pool address
  rewardsDuration: string;
  periodFinish: string;
  rewardRate: string;
  rewardPerTokenStored: string;
  totalSupply: string; // Total amount of tokens staked
  stakingToken: string; // Address of token being staked
  indexPool: string; // Address of related index pool
  isWethPair: boolean; // Whether the pool is for a UNI LP pair
  /** Unix timestamp for when staking pool begins */
  startsAt: string;
  totalRewards: string;
}