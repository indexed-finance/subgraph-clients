export interface NetworkSubgraphs {
  indexedCore: string;
  uniswap: string;
  indexedStaking: string;
  masterChef: string;
  nirn: string;
  dndx: string;
}

export const SUBGRAPH_URLS: Record<string, NetworkSubgraphs> = {
  mainnet: {
    indexedCore: 'https://api.thegraph.com/subgraphs/name/indexed-finance/indexed',
    uniswap: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    indexedStaking: 'https://api.thegraph.com/subgraphs/name/indexed-finance/staking',
    masterChef: 'https://api.thegraph.com/subgraphs/name/sushiswap/master-chef',
    nirn: 'https://api.thegraph.com/subgraphs/name/indexed-finance/nirn',
    dndx: 'https://api.thegraph.com/subgraphs/name/indexed-finance/indexed-dividends'
  },
  rinkeby: {
    indexedCore: 'https://api.thegraph.com/subgraphs/name/indexed-finance/indexed-rinkeby',
    uniswap: 'https://api.thegraph.com/subgraphs/name/samgos/uniswap-v2-rinkeby',
    indexedStaking: 'https://api.thegraph.com/subgraphs/name/indexed-finance/rinkeby-staking',
    masterChef: '',
    nirn: '',
    dndx: ''
  }
}

export const GOV_SUBGRAPH_URLS: Record<string, string> = {
  indexed: 'https://api.thegraph.com/subgraphs/name/indexed-finance/indexed-governance',
  compound: 'https://api.thegraph.com/subgraphs/name/protofire/compound-governance',
  uniswap: 'https://api.thegraph.com/subgraphs/name/ianlapham/governance-tracking',
}