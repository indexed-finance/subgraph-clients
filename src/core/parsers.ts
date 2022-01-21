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
  PoolSwapData,
  PoolSwapReturnData,
  IndexPoolUpdateReturnData,
  IndexPoolUpdateData
} from "./types";

export const parseIndexPoolUpdate = ({
  dailySnapshots,
  tokens
}: IndexPoolUpdateReturnData): IndexPoolUpdateData => {
  const snapshot = parseDailySnapshot(dailySnapshots[0]);
  const lastSnapshot = parseDailySnapshot(dailySnapshots[1]);
  snapshot.dailyFeesUSD = snapshot.feesTotalUSD - lastSnapshot.feesTotalUSD;
  snapshot.dailySwapVolumeUSD = snapshot.totalSwapVolumeUSD - lastSnapshot.totalSwapVolumeUSD;
  const tokenPrices = tokens.reduce(
    (obj, t) => ({ ...obj, [t.token.id]: +(t.token.priceUSD) }),
    {}
  );
  return { snapshot, tokenPrices };
}

export const parsePoolSwapData = ({
  timestamp,
  ...rest
}: PoolSwapReturnData): PoolSwapData => ({
  timestamp: +timestamp,
  ...rest
})

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
