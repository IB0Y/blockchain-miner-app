const Transaction = require('../blockchain/transaction');

const { INITIAL_BALANCE } = require('../config');
const CoinUtil = require('../coin-util');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = CoinUtil.generateKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  toString(){
    return `Wallet -
            PublicKey : ${this.publicKey}
            Balance   : ${this.balance}`;
  }

  sign(dataHash){
    return this.keyPair.sign(dataHash);
  }

  createTransaction (recipient, amount, blockchain, transactionPool) {

    this.balance = this.calculateBalance(blockchain);

    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds current balance : ${this.balance}`);
      return;
    }

    let transaction = transactionPool.transactionExists(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }


  // Calculate balance
    calculateBalance(blockchain){
      let balance = this.balance;
      let transactions = [];
      // GEt all transactions from  the blockchain
      blockchain.chain.forEach(block => block.data.forEach(transaction => {
        transactions.push(transaction);
      }));

      // Filter the ones dedicated to this address
      const walletInputTs = transactions.filter(transaction => transaction.input.address === this.publicKey);

      let startTime = 0;

     // Get the most recent transaction  made by wallet to others
      if (walletInputTs.length > 0) {
        const recentInputT = walletInputTs.reduce((previous, current) => previous.input.timestamp > current.input.timestamp ? previous : current);

        balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
        startTime = recentInputT.input.timestamp;
      }



      // Get all output amounts to this address after the startTime -> From outside
      transactions.forEach(transaction => {
        if (transaction.input.timestamp > startTime) {
          transaction.outputs.find(output => {
            if (output.address === this.publicKey) {
              balance += output.amount;
            }
          });
        }
      });

      return balance;

    }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = "blockchain-wallet";

    return blockchainWallet;
  }




}

module.exports = Wallet;
