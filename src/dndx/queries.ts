import gql from 'graphql-tag'

export const DNDX_DATA = gql`
query dndxData {
  dndxs(first: 1) {
    id
    depositToken
    dividendsToken
    minLockDuration
    maxLockDuration
    minEarlyWithdrawalFee
    baseEarlyWithdrawalFee
    maxDividendsBonusMultiplier
    minimumDeposit
    feeRecipient
    unlocked
    totalDeposits
    totalDividendShares
    totalEthDistributed
    totalEthWithdrawn
    totalEarlyWithdrawalFees
    numDisbursals
    numLocks
  }
}
`

export const LOCK_BY_ID = gql`
query lockData($lockId: Bytes!) {
  timeLock(id: $lockId) {
    id
    owner
    createdAt
    ndxAmount
    duration
    dndxShares
  }
}
`

export const LOCKS_BY_OWNER = gql`
query locksByOwner($owner: Bytes!) {
  timeLocks(first: 100, where: { owner: $owner }) {
    id
    owner
    createdAt
    ndxAmount
    duration
    dndxShares
  }
}
`