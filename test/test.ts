import {
  checkHealth,
  IndexedStakingSubgraphClient,
  IndexedCoreSubgraphClient
} from "../src/index";

const coreClient = IndexedCoreSubgraphClient.forNetwork('mainnet')
const stakingClient = IndexedStakingSubgraphClient.forNetwork('rinkeby')

async function test() {
  // const pools = await client.getAllStakingPools()
  // console.log(pools)
  // const health = await checkHealth('indexed-finance/rinkeby-staking')
  // console .log(health.data.indexingStatusForCurrentVersion.fatalError)
  const res = await stakingClient.getStakingInfo()
  console.log(res)
}
test()