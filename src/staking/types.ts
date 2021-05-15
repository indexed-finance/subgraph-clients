export type AllStakingInfoData = {
  id: string;
  owner: string;
  rewardsSchedule: string;
  startBlock: number;
  endBlock: number;
  rewardsToken: string;
  totalAllocPoint: number;
  poolCount: number
  pools: PoolData[];
}

export type PoolData = {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  isPairToken: boolean;
  allocPoint: number;
  lastRewardBlock: number;
  userCount: number;
  updatedAt: number;
}

// Raw Types

export type AllStakingInfoReturnData = {
  id: string;
  owner: string;
  rewardsSchedule: string;
  startBlock: string;
  endBlock: string;
  rewardsToken: string;
  totalAllocPoint: string;
  poolCount: string
  pools: PoolReturnData[];
}

export type PoolReturnData = {
  id: string;
  symbol: string;
  name: string;
  decimals: string;
  balance: string;
  isPairToken: boolean;
  allocPoint: string;
  lastRewardBlock: string;
  userCount: string;
  updatedAt: string;
}