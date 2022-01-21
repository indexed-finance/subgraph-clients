export type DailyPoolSnapshotPartialData = {
  id: string;
  date: number;
  value: number;
  dailyFeesUSD: number;
  dailySwapVolumeUSD: number;
  totalSupply: string;
  feesTotalUSD: number;
  totalValueLockedUSD: number;
  totalSwapVolumeUSD: number;
  totalVolumeUSD: number;
}

export type TokenData = {
  id: string;
  decimals: number;
  name: string;
  symbol: string;
  priceUSD: number;
}

export type PoolTokenData = {
  id: string;
  token: TokenData;
  ready: boolean;
  balance: string;
  minimumBalance: string;
  denorm: string;
  desiredDenorm: string;
}

export type IndexPoolData = {
  id: string;
  category: { id: string; };
  size: number;
  name: string;
  symbol: string;
  isPublic: boolean;
  totalSupply: string;
  totalWeight: string;
  swapFee: number;
  exitFee: number;
  feesTotalUSD: number;
  totalValueLockedUSD: number;
  totalVolumeUSD: number;
  totalSwapVolumeUSD: number;
  tokensList: string[];
  poolInitializer: {
    id: string;
    totalCreditedWETH: string;
    tokens: {
      token: {
        id: string;
        decimals: number;
        name: string;
        symbol: string;
        priceUSD: number;
      }
      balance: string;
      targetBalance: string;
      amountRemaining: string;
    }[];
  }
  tokens: PoolTokenData[];
  dailySnapshots: DailyPoolSnapshotPartialData[]
}

export type IndexPoolUpdateData = {
  snapshot: DailyPoolSnapshotPartialData;
  tokenPrices: Record<string, number>;
}

export type NdxStakingPoolData = {
  id: string;
  isWethPair: boolean;
  startsAt: number;
  isReady: boolean;
  indexPool: string;
  stakingToken: string;
  totalSupply: string;
  periodFinish: number;
  lastUpdateTime: number;
  totalRewards: string;
  claimedRewards: string;
  rewardRate: string;
  rewardPerTokenStored: string;
}

export type PoolSwapData = {
  id: string;
  tokenIn: string;
  tokenOut: string;
  tokenAmountIn: string;
  tokenAmountOut: string;
  timestamp: number;
}

/* Raw Types */

export type DailyPoolSnapshotPartialReturnData = {
  id: string;
  date: string;
  value: string;
  dailyFeesUSD: string;
  dailySwapVolumeUSD: string;
  totalSupply: string;
  feesTotalUSD: string;
  totalValueLockedUSD: string;
  totalSwapVolumeUSD: string;
  totalVolumeUSD: string;
}

export type TokenReturnData = {
  id: string;
  decimals: string;
  name: string;
  symbol: string;
  priceUSD: string;
}

export type PoolTokenReturnData = {
  id: string;
  token: TokenReturnData;
  ready: boolean;
  balance: string;
  minimumBalance: string;
  denorm: string;
  desiredDenorm: string;
}

export type IndexPoolReturnData = {
  id: string;
  category: { id: string; };
  size: string;
  name: string;
  symbol: string;
  isPublic: boolean;
  totalSupply: string;
  totalWeight: string;
  swapFee: string;
  exitFee: string;
  feesTotalUSD: string;
  totalValueLockedUSD: string;
  totalVolumeUSD: string;
  totalSwapVolumeUSD: string;
  tokensList: string[];
  poolInitializer: {
    id: string;
    totalCreditedWETH: string;
    tokens: {
      token: {
        id: string;
        decimals: string;
        name: string;
        symbol: string;
        priceUSD: string;
      }
      balance: string;
      targetBalance: string;
      amountRemaining: string;
    }[];
  }
  tokens: PoolTokenReturnData[];
  dailySnapshots: DailyPoolSnapshotPartialReturnData[]
}

export type IndexPoolUpdateReturnData = {
  dailySnapshots: DailyPoolSnapshotPartialReturnData[];
  tokens: {
    token: {
      id: string;
      priceUSD: string;
    }
  }[];
}

export type NdxStakingPoolReturnData = {
  id: string;
  isWethPair: boolean;
  startsAt: string;
  isReady: boolean;
  indexPool: string;
  stakingToken: string;
  totalSupply: string;
  periodFinish: string;
  lastUpdateTime: string;
  totalRewards: string;
  claimedRewards: string;
  rewardRate: string;
  rewardPerTokenStored: string;
}

export type PoolSwapReturnData = {
  id: string;
  tokenIn: string;
  tokenOut: string;
  tokenAmountIn: string;
  tokenAmountOut: string;
  timestamp: string;
}