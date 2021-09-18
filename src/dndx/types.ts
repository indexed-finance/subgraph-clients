export type DNDXData = {
  id: string
  depositToken: string
  dividendsToken: string
  minLockDuration: number
  maxLockDuration: number
  minEarlyWithdrawalFee: string
  baseEarlyWithdrawalFee: string
  maxDividendsBonusMultiplier: string
  minimumDeposit: string
  feeRecipient: string
  unlocked: boolean
  totalDeposits: string
  totalDividendShares: string
  totalEthDistributed: string
  totalEthWithdrawn: string
  totalEarlyWithdrawalFees: string
  numDisbursals: number
  numLocks: number
}

export type DisbursalData = {
  id: string
  sender: string
  disbursedAt: number
  ethDistributed: string
  totalDividendShares: string
}

export type TimeLockData = {
  id: string
  owner: string
  createdAt: number
  ndxAmount: string
  duration: number
  dndxShares: string
}


export type DNDXReturnData = {
  id: string
  depositToken: string
  dividendsToken: string
  minLockDuration: string
  maxLockDuration: string
  minEarlyWithdrawalFee: string
  baseEarlyWithdrawalFee: string
  maxDividendsBonusMultiplier: string
  minimumDeposit: string
  feeRecipient: string
  unlocked: boolean
  totalDeposits: string
  totalDividendShares: string
  totalEthDistributed: string
  totalEthWithdrawn: string
  totalEarlyWithdrawalFees: string
  numDisbursals: string
  numLocks: string
}

export type DisbursalReturnData = {
  id: string
  sender: string
  disbursedAt: string
  ethDistributed: string
  totalDividendShares: string
}

export type TimeLockReturnData = {
  id: string
  owner: string
  createdAt: string
  ndxAmount: string
  duration: string
  dndxShares: string
}