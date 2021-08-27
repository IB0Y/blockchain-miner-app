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

app.post('/mine', (req, res) => {
	const block = miner.mine();
	res.json({ block });
});

//Servers
p2pServer.listen()
	.then(() => {
		setInterval(() => {
				const t = miner.mine();
				// .log(`Index: ${time}`);
				console.log(t);
		}, 10000)
	})
 // app.listen(HTTP_PORT, () => {
 //   console.log(`Listening on port ${HTTP_PORT}`);
 //
 // });


// while (1) {
//    const t = miner.mine();
//    console.log(`Index: ${time}`);
//    console.log(t);
//    time++;
//  }
