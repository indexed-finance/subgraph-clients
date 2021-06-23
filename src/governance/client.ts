import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-fetch'
import { defaultAbiCoder } from "@ethersproject/abi";
import { Proposal, ProposalReturnData, ProposalVoter, ProposalVoterReturnData } from "./types";
import { GOV_SUBGRAPH_URLS } from '../constants';
import { PROPOSALS } from './queries';

const parseVoter = ({ support, voter: { id: voter }, votes }: ProposalVoterReturnData): ProposalVoter => ({ votes, voter, support });

const parseProposal = (p: ProposalReturnData): Proposal => ({
  id: p.id,
  title: p.description?.split(/# |\n/g)[1] || p.description?.split(/# |\n/g)[2] || 'Untitled',
  description: p.description || 'No description.',
  proposer: p.proposer.id,
  status: undefined, // initialize as 0
  forCount: p.forVotes.reduce((total, { votes }) => total + parseFloat(votes), 0), // initialize as 0
  againstCount: p.againstVotes.reduce((total, { votes }) => total + parseFloat(votes), 0), // initialize as 0
  startBlock: parseInt(p.startBlock),
  endBlock: parseInt(p.endBlock),
  forVotes: p.forVotes.map(parseVoter),
  againstVotes: p.againstVotes.map(parseVoter),
  details: p.targets.map((t, i) => {
    const signature = p.signatures[i]
    const [name, types] = signature.substr(0, signature.length - 1).split('(')

    const calldata = p.calldatas[i]
    const decoded = defaultAbiCoder.decode(types.split(','), calldata)

    return {
      target: p.targets[i],
      functionSig: name,
      callData: decoded.toString()
    }
  })
})

export default class GovernanceSubgraphClient {
  constructor(public client: ApolloClient<unknown>) {}

  static forProtocol(protocol: 'indexed' | 'compound' | 'uniswap') {
    const client = new ApolloClient({
      link: new HttpLink({ uri: GOV_SUBGRAPH_URLS[protocol], fetch }),
      cache: new InMemoryCache(),
      shouldBatch: true,
    } as any);
    return new GovernanceSubgraphClient(client);
  }

  async getProposals(): Promise<Proposal[]> {
    return this.client.query({
      query: PROPOSALS,
      fetchPolicy: 'cache-first'
    }).then((result) => result.data.proposals.map(parseProposal))
  }

  /* async getStakingInfo(): Promise<AllMasterChefData> {
    return this.client.query({
      query: ALL_STAKING_INFO,
      fetchPolicy: 'cache-first'
    }).then((result) => parseStakingInfo(result.data.masterChefs[0]));
  } */
}