const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data){
    const previousBlock = this.chain[this.chain.length -1]; //contence
    const newBlock = Block.mine(previousBlock, data);
    this.chain.push(newBlock);

    return newBlock;
  }

  isValidChain(chain){
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (var i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash || currentBlock.hash !== Block.blockHash(currentBlock)) {
        return false;
      }
    }

    return true;
  }


  replaceChain(newChain){
    if (newChain.length <= this.chain.length) {
      console.log("Received chain is not longer than current chain.");
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log("Recieved chain is not valid");
      return;
    }

    console.log("Replacing current chain with received chain...");
    this.chain = newChain; //try a while loop to display while replacing.
    console.log("Current chain replaced.");
    return;
  }
}


module.exports = Blockchain;
