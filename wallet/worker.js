const Miner = require('./miner');

const startMining = async (blockchain, transactionPool, wallet, p2pServer) => {
  const miner = new Miner(blockchain, transactionPool, wallet, p2pServer);
  let newBlock = await miner.mine();
}
