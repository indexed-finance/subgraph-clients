export type TokenData = {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
}

export type TokenReturnData = {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
}

export type ProtocolAdapter = {
  id: string;
  address: string;
  name: string;
  tokenAdaptersCount: number;
}

export type ProtocolAdapterReturnData = {
  id: string;
  address: string;
  name: string;
  tokenAdaptersCount: string;
}

type TokenType = TokenData | TokenReturnData

export type TokenAdapter<T extends TokenType = TokenData> = {
  id: string;
  name: string;
  underlying: T;
  wrapper: T;
  protocol: Omit<ProtocolAdapter, "tokenAdaptersCount">
}

export type TokenAdapterReturnData = TokenAdapter<TokenReturnData>

export type VaultSnapshot = {
  id: string;
  timestamp: number;
  type: "Daily" | "Rebalance"
  totalValue: string;
  totalFeesClaimed: string;
  revenueTokens: string[];
  revenueAPRs: number[];
  adapters: string[];
  weights: number[];
  apr: number;
}

export type VaultSnapshotReturnData = {
  id: string;
  timestamp: string;
  type: "Daily" | "Rebalance"
  totalValue: string;
  totalFeesClaimed: string;
  revenueTokens: string[];
  revenueAPRs: string[];
  adapters: string[];
  weights: string[];
  apr: string;
}

export type VaultData = {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  totalFeesClaimed: string;
  underlying: TokenData;
  feeRecipient: string;
  rewardsSeller: string;
  performanceFee: number;
  reserveRatio: number;
  adapters: TokenAdapter[]
  weights: number[]
  snapshots: VaultSnapshot[]
}

export type VaultReturnData = {
  id: string;
  symbol: string;
  name: string;
  decimals: string;
  totalFeesClaimed: string;
  underlying: TokenReturnData;
  feeRecipient: string;
  rewardsSeller: string;
  performanceFee: string;
  reserveRatio: string;
  adapters: TokenAdapter[]
  weights: string[]
  snapshots: VaultSnapshotReturnData[]
}