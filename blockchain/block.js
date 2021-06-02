const CoinUtil = require('../coin-util');
const {DIFFICULTY, MINE_RATE} = require('../config');

class Block {
  constructor(timestamp, previousHash, hash, nonce, difficulty, data) {
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
    this.data = data;
  }

  toString(){
    return `Block -
      Timestamp    : ${this.timestamp}
      PreviousHash : ${this.previousHash}
      Hash         : ${this.hash}
      Nonce        : ${this.nonce}
      Difficulty   : ${this.difficulty}
      Data         : ${this.data}`;
  }

  static genesis(){
    return new this(
      '1618987447870',
      'G3n3$i$_Pr3viou$Ha$h',
      'G3n3$i$_ha$h',
       0,
       DIFFICULTY,
      []
    );
  }

  static mine(previousBlock, data){
    let hash, timestamp;
    const previousHash = previousBlock.hash;
    let nonce = 0;
    let {difficulty} = previousBlock;

    // Proof of work
      do {
        nonce++;
        timestamp = Date.now();
        difficulty = Block.dynamicDifficulty(previousBlock, timestamp);
        hash = Block.hash(timestamp, previousHash, nonce, difficulty, data);

      } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(
      timestamp,
      previousHash,
      hash,
      nonce,
      difficulty,
      data
    );
  }

  static dynamicDifficulty(previousBlock, currentTime){
    let {difficulty} = previousBlock;
    difficulty = previousBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }

  static hash(timestamp, previousHash, nonce, difficulty, data){
    return CoinUtil.hash(`${timestamp}${previousHash}${nonce}${difficulty}${data}`).toString();
  }

  static blockHash(block){
    const {timestamp, previousHash, nonce, difficulty, data} = block;
    return Block.hash(timestamp, previousHash, nonce, difficulty, data);
  }

}

module.exports = Block;
