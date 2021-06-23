import gql from 'graphql-tag'

export const GLOBAL_DATA = gql`
  query governance {
    governances(first: 1) {
      delegatedVotes
      delegatedVotesRaw
      totalTokenHolders
      totalDelegates
    }
  }
`

// fetch top delegates by votes delegated at current time
export const TOP_DELEGATES = gql`
  query delegates {
    delegates(first: 100, orderBy: delegatedVotes, orderDirection: desc) {
      id
      delegatedVotes
      delegatedVotesRaw
      tokenHoldersRepresentedAmount
      votes {
        id
        votes
        support
      }
    }
  }
`

// fetch top delegates by votes delegated at current time
export const DELEGATES_FROM_LIST = gql`
  query delegates($list: [Bytes!]) {
    delegates(first: 500, orderBy: delegatedVotes, orderDirection: desc, where: { id_in: $list }) {
      id
      delegatedVotes
      delegatedVotesRaw
      tokenHoldersRepresentedAmount
      votes {
        id
        votes
        support
      }
    }
  }
`

// all proposals
export const PROPOSALS = gql`
  query proposals {
    proposals(first: 100, orderBy: startBlock, orderDirection: desc) {
      id
      targets
      values
      signatures
      status
      calldatas
      description
      startBlock
      endBlock
      proposer {
        id
      }
      forVotes: votes(first: 5, orderBy: votesRaw, orderDirection: desc, where: { support: true }) {
        support
        votes
        voter {
          id
        }
      }
      againstVotes: votes(first: 5, orderBy: votesRaw, orderDirection: desc, where: { support: false }) {
        support
        votes
        voter {
          id
        }
      }
    }
  }
`

export const ALL_VOTERS = gql`
  query voters($proposalID: String!) {
    votes(
      first: 1000
      where: { proposal: $proposalID, votes_gt: 1 }
      orderBy: votes
      orderDirection: desc
    ) {
      support
      voter {
        id
      }
      votes
    }
  }
`

export const DELEGATE_INFO = gql`
  query delegates($address: Bytes!) {
    delegates(where: { id: $address }) {
      id
      delegatedVotes
      tokenHoldersRepresentedAmount
      votes {
        proposal {
          id
        }
        support
        votes
      }
    }
  }
`