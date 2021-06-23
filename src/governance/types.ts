export interface ProposalDetail {
  target: string
  functionSig: string
  callData: string
}

export interface ProposalVoter {
  support: boolean
  votes: string
  voter: string
}

export interface ProposalVoterReturnData {
  support: boolean
  votes: string
  voter: {
    id: string
  }
}

type VoterUnion = ProposalVoter | ProposalVoterReturnData

export interface Proposal<VoterType extends VoterUnion = ProposalVoter> {
  id: string
  title: string
  description: string
  proposer: string
  status: string
  forCount: number | undefined
  againstCount: number | undefined
  startBlock: number
  endBlock: number
  details: ProposalDetail[]
  forVotes: VoterType[]
  againstVotes: VoterType[]
}

export interface DelegateData {
  id: string
  delegatedVotes: number
  delegatedVotesRaw: number
  votes: {
    id: string
    support: boolean
    votes: number
  }[]
}

export interface ProposalReturnData {
  id: string
  proposer: {
    [id: string]: string
  }
  description: string
  status: string | undefined
  targets: string[]
  values: string[]
  signatures: string[]
  calldatas: string[]
  startBlock: string
  endBlock: string
  forVotes: ProposalVoterReturnData[]
  againstVotes: ProposalVoterReturnData[]
}