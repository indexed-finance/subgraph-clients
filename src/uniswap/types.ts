export type PairSwapData = {
  transaction: {
    id: string;
  }
  pair: {
    id: string;
    token0: {
      id: string;
      symbol: string;
    }
    token1: {
      id: string;
      symbol: string;
    }
  }
  amount0In: number;
  amount1In: number;
  amount0Out: number;
  amount1Out: number;
  amountUSD: number;
  timestamp: number;
}

export type PairSwapReturnData = {
  transaction: {
    id: string;
  }
  pair: {
    id: string;
    token0: {
      id: string;
      symbol: string;
    }
    token1: {
      id: string;
      symbol: string;
    }
  }
  amount0In: string;
  amount1In: string;
  amount0Out: string;
  amount1Out: string;
  amountUSD: string;
  timestamp: string;
}