const Block = require('./block');
const Blockchain = require('./index');

describe("Blockchain", () => {
  let blockchain, bc2;
  beforeEach(() => {
    blockchain = new Blockchain();
    bc2 = new Blockchain();
  });

  it("starts with the genesis block", () =>{
    expect(blockchain.chain[0]).toEqual(Block.genesis())
  });

  it("adds a new block", () => {
    const data = "pans";
    blockchain.addBlock(data);

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });

  it("validates a valid chain", () =>{
    bc2.addBlock("working");
    // console.log(bc2);
    expect(blockchain.isValidChain(bc2.chain)).toBe(true);
  });

  // validation

  it("invalidates a chain with a corrupt genesis block", () => {
    bc2.chain[0].data = "new data";

    expect(blockchain.isValidChain(bc2.chain)).toBe(false);
  });

  it("invalidates a corrupt chain", () => {
    bc2.addBlock("second data");
    bc2.chain[1].data = "corrupt";

    expect(blockchain.isValidChain(bc2.chain)).toBe(false);
  });

  // chain replacement
  it("replaces the chain with a valid chain", () => {
    bc2.addBlock("second data");

    blockchain.replaceChain(bc2.chain);

    expect(blockchain.chain).toEqual(bc2.chain);
  });

  it("does not replace the chain with one with less or equal legth", () => {
    blockchain.addBlock("second data");
    blockchain.replaceChain(bc2.chain);

    expect(blockchain.chain).not.toEqual(bc2.chain);
  });
});
