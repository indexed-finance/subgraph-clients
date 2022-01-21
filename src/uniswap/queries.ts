import gql from 'graphql-tag'

export const PAIR_SWAPS_BULK = (pairs: string[], numSwaps: number) => {
  const swapQuery = (pair: string) => `
  q_${pair}: swaps(orderBy: timestamp, orderDirection: desc, first: ${numSwaps}, where: { pair: "${pair}" }) {
    transaction {
      id
    }
    pair {
      id
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
    amount0In
    amount1In
    amount0Out
    amount1Out
    amountUSD
    timestamp
  }
  `
  const queryString = `
  query swapsBulk {
    ${pairs.map(swapQuery).join('\n')}
  }
`;
  return gql(queryString)
}
