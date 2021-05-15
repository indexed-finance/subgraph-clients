export interface NetworkSubgraphs {
  indexedCore: string;
  uniswap: string;
  indexedStaking: string;
}

export const SUBGRAPH_URLS: Record<string, NetworkSubgraphs> = {
  mainnet: {
    indexedCore: 'https://api.thegraph.com/subgraphs/name/indexed-finance/indexed',
    uniswap: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    indexedStaking: ''
  },
  rinkeby: {
    indexedCore: 'https://api.thegraph.com/subgraphs/name/indexed-finance/indexed-rinkeby',
    uniswap: 'https://api.thegraph.com/subgraphs/name/samgos/uniswap-v2-rinkeby',
    indexedStaking: 'https://api.thegraph.com/subgraphs/name/indexed-finance/rinkeby-staking'
  }
}