import {
  DailyPoolSnapshotPartialData,
  DailyPoolSnapshotPartialReturnData,
  IndexPoolData,
  IndexPoolReturnData,
  NdxStakingPoolData,
  NdxStakingPoolReturnData,
  PoolTokenData,
  PoolTokenReturnData,
  TokenData,
  TokenReturnData,
} from "./types";

export const parseToken = (token: TokenReturnData): TokenData => ({
  ...token,
  decimals: +token.decimals,
  priceUSD: +token.priceUSD,
});

export const parsePoolToken = ({
  token,
  ...rest
}: PoolTokenReturnData): PoolTokenData => ({
  ...rest,
  token: parseToken(token),
});

export const parseDailySnapshot = ({
  date,
  value,
  feesTotalUSD,
  totalValueLockedUSD,
  totalSwapVolumeUSD,
  totalVolumeUSD,
  dailyFeesUSD,
  dailySwapVolumeUSD,
  ...rest
}: DailyPoolSnapshotPartialReturnData): DailyPoolSnapshotPartialData => ({
  ...rest,
  date: +date,
  value: +value,
  feesTotalUSD: +feesTotalUSD,
  totalValueLockedUSD: +totalValueLockedUSD,
  totalSwapVolumeUSD: +totalSwapVolumeUSD,
  totalVolumeUSD: +totalVolumeUSD,
  dailyFeesUSD: +dailyFeesUSD,
  dailySwapVolumeUSD: +dailySwapVolumeUSD,
});

export const parsePool = ({
  size,
  swapFee,
  exitFee,
  feesTotalUSD,
  totalValueLockedUSD,
  totalVolumeUSD,
  totalSwapVolumeUSD,
  dailySnapshots,
  tokens,
  poolInitializer,
  ...rest
}: IndexPoolReturnData): IndexPoolData => ({
  ...rest,
  size: +size,
  swapFee: +swapFee,
  exitFee: +exitFee,
  feesTotalUSD: +feesTotalUSD,
  totalValueLockedUSD: +totalValueLockedUSD,
  totalVolumeUSD: +totalVolumeUSD,
  totalSwapVolumeUSD: +totalSwapVolumeUSD,
  poolInitializer: {
    ...poolInitializer,
    tokens: poolInitializer.tokens.map(({ token, ...tokenRest }) => ({
      ...tokenRest,
      token: parseToken(token),
    })),
  },
  tokens: tokens.map(parsePoolToken),
  dailySnapshots: dailySnapshots.map(parseDailySnapshot),
});

export const parseStakingPool = ({
  startsAt,
  periodFinish,
  lastUpdateTime,
  ...rest
}: NdxStakingPoolReturnData): NdxStakingPoolData => ({
  ...rest,
  startsAt: +startsAt,
  periodFinish: +periodFinish,
  lastUpdateTime: +lastUpdateTime,
});
