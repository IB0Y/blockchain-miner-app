const Transaction = require('./transaction');

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction){

    let transactionWithId = this.transactions.find(t => t.id === transaction.id);

    if (transactionWithId){
        // transactionWithId1 = this.transactions.find(t => t.id === transaction.id);
        // this.transactions[this.transactions.indexOf(transactionWithId1)] = transaction;
        for (var i = 0; i < this.transactions.length; i++) {

          if (this.transactions[i] === transaction) {
            this.transactions[i] = transaction
          }
        }
    } else {
      this.transactions.push(transaction);
    }

  }


// Confirm if transaction exists already
  transactionExists(address){
    return this.transactions.find(transaction => transaction.input.address === address);
  }


// Returns valid transactions
  validTransactions(){
    return this.transactions.filter(transaction => {
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);

      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}.`);
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}.`);
        return;
      }
      return transaction;
    });
  }


  // Clears the pool transactions
  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool
