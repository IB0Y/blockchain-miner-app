const express = require('express');
const bodyParser = require('body-parser');

//Classes
const Blockchain = require('./blockchain');
const P2pServer = require('./network/p2p-server');
const Miner = require('./miner');
const Wallet = require('./wallet');
const TransactionPool = require('./blockchain/transaction-pool');

//Declarations
const HTTP_PORT = process.env.HTTP_PORT || 3002;

const app = express();


const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const p2pServer = new P2pServer(blockchain, transactionPool);
const miner = new Miner(blockchain, transactionPool, wallet, p2pServer);

// middlewares
app.use(bodyParser.json());

// Routes

// Get transactions from pool
// app.get('/transactions',(req, res) => {
//   res.json(transactionPool.transactions);
// });
//
//
// // Get PublicKey
// app.get('/public-Key', (req, res) => {
//   res.json({
//     publicKey : wallet.publicKey
//   });
// });
//
// // Get PublicKey
// app.get('/wallet', (req, res) => {
//   res.json({
//     publicKey : wallet.publicKey,
//     balance : wallet.balance
//   });
// });
//
// // Mine transactions
//  app.get('/mine-transactions', (req, res) => {
//    const block = miner.mine();
//    console.log(`New Block mined: ${block.toString()}`);
//
//    res.json({
//      block
//    });
//  });


//Servers
p2pServer.listen();
// app.listen(HTTP_PORT, () => {
//   // while (1) {
//   //   const t = miner.mine();
//   //   console.log(t);
//   // }
//   console.log(`Listening on port ${HTTP_PORT}`);
// });
let time = 0;
// while (1) {
//    const t = miner.mine();
//    console.log(`Index: ${time}`);
//    console.log(t);
//    time++;
//  }
