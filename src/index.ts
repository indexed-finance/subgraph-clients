import gql from "graphql-tag";
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'

export { default as IndexedStakingSubgraphClient } from './staking/client'
export { default as IndexedCoreSubgraphClient } from './core/client'

const HEALTH_QUERY = gql`
query health($subgraphName: String!) {
  indexingStatusForCurrentVersion(subgraphName: $subgraphName) {
    synced
    health
    fatalError {
      message
      block {
        number
        hash
      }
      handler
    }
    chains {
      chainHeadBlock {
        number
      }
      latestBlock {
        number
      }
    }
  }
}
`

export async function checkHealth(subgraphName: string) {
  const client = new ApolloClient({
    link: new HttpLink({ uri: 'https://api.thegraph.com/index-node/graphql', fetch }),
    cache: new InMemoryCache(),
    shouldBatch: true,
  } as any);
  const result = await client.query({
    query: HEALTH_QUERY,
    variables: { subgraphName },
    fetchPolicy: 'cache-first'
  });
  return result;
}