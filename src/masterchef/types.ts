export type AllMasterChefData = {
  id: string;
  owner: string;
  startBlock: number;
  sushiPerBlock: string;
  totalAllocPoint: number;
  poolCount: number
  pools: MasterChefPoolData[];
}

export type MasterChefPoolData = {
  id: string;
  token: string;
  // isPairToken: boolean;
  // token0?: string;
  // token1?: string;
  balance: string;
  allocPoint: number;
  lastRewardBlock: number;
  userCount: number;
  updatedAt: number;
}

// Raw Types

export type AllMasterChefReturnData = {
  id: string;
  owner: string;
  startBlock: string;
  sushiPerBlock: string;
  totalAllocPoint: string;
  poolCount: string
  pools: MasterChefPoolReturnData[];
}

export type MasterChefPoolReturnData = {
  id: string;
  pair: string;
  // isPairToken: boolean;
  // token0?: string;
  // token1?: string;
  balance: string;
  allocPoint: string;
  lastRewardBlock: string;
  userCount: string;
  updatedAt: string;
}