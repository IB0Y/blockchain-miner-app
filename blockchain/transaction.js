const CoinUtil = require('../coin-util');
const { MINING_REWARD } = require('../config');

class Transaction {
  constructor() {
    this.id = CoinUtil.id();
    this.input = null;
    this.outputs = [];
  }

  // Update transaction with new outputs created within same time.
    update(senderWallet, recipient, amount) {
      const senderOutput = this.outputs.find( output => output.address === senderWallet.publicKey);
      if (amount > senderOutput.amount) {
        console.log(`Amount : ${amount} exceeds balance available in wallet.`);
        return;
      }

      senderOutput.amount = senderOutput.amount - amount;
      this.outputs.push({
        amount,
        address: recipient
      });

      // sign transaction
      Transaction.signTransaction(this, senderWallet);
      return this;
    }

    // Helper function
    static transactionWithOutputs(senderWallet, outputs){
      const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static newTransaction(senderWallet, recipient, amount){

      if (amount > senderWallet.balance) {
        console.log(`Amount: ${amount} exceeds balance`);
        return;
      }

      return Transaction.transactionWithOutputs(senderWallet, [
        {
          amount : senderWallet.balance - amount,
          address: senderWallet.publicKey
        },
        {
          amount: amount,
          address: recipient
        }
      ]);
    }

// Miner Reward transaction
    static rewardTransaction(minerWallet, blockchainWallet){
      return Transaction.transactionWithOutputs(blockchainWallet, [{
        amount: MINING_REWARD,
        address: minerWallet.publicKey,
      }]);
    }



    static signTransaction(transaction, senderWallet){
      transaction.input = {
        timestamp : Date.now(),
        amount    : senderWallet.balance,
        address   : senderWallet.publicKey,
        signature : senderWallet.sign(CoinUtil.hash(transaction.outputs))
      };
      return;
    }


    static verifyTransaction(transaction){
      return CoinUtil.verifySignature(
        transaction.input.address,
        transaction.input.signature,
        CoinUtil.hash(transaction.outputs)
      );
    }
}

module.exports = Transaction;
