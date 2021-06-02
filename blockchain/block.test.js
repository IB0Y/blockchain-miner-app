const Block = require('./block');

describe("Block", () => {
  let data, previousBlock, newBlock;
  beforeEach(() => {
     data = "Data trial";
     previousBlock = Block.genesis();
     newBlock = Block.mine(previousBlock, data);

  });
  it("sets the `data` to match the input", () => {
    expect(newBlock.data).toEqual(data);
  });

  it("sets the `previousHash` to match the hash of the prevous block", () =>{
    expect(newBlock.previousHash).toEqual(previousBlock.hash);
  });

  it("generates a hash that matches the difficulty", () => {
    expect(newBlock.hash.substring(0, newBlock.difficulty)).toEqual('0'.repeat(newBlock.difficulty));
    // console.log(newBlock.toString());
  });

  it("lowers the difficulty for a slowly mined block", () => {
    expect(Block.dynamicDifficulty(newBlock, newBlock.timestamp + 360000)).toEqual(newBlock.difficulty - 1);
  });

  it("it raises the difficulty for a quickly mined block", () => {
    expect(Block.dynamicDifficulty(newBlock, newBlock.timestamp + 1)).toEqual(newBlock.difficulty + 1);

  });
});
