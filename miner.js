const Wallet = require('./wallet');
const Transaction = require('./blockchain/transaction');

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine(){
      const validTransactions = this.transactionPool.validTransactions();
      // include miner's reward
      validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));

      // create a block using valid transactions.
      const block = this.blockchain.addBlock(validTransactions);
      // syncChains()
      this.p2pServer.syncChains();
      // clear transactionPool
      this.transactionPool.clear();

      // and broadcast Transaction pool
      this.p2pServer.broadcastClearTransactions();

      return block;
    }

}

module.exports = Miner;
