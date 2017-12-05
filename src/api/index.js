import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import Web3 from 'web3';
import Tx from 'ethereumjs-tx'; 

export default ({ config, db }) => {
	let api = Router();
	
	var web3 = new Web3(                                                //connect to a remote node to 
		new Web3.providers.HttpProvider('https://rinkeby.infura.io/')   //communicate with the ethereum network
	);
	
	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/createWallet', (req, res) => {
		var account = web3.eth.accounts.create();      //create an account from the web3 boilerplate
		var wallet = {                                 //edit it to our purpose
			address: wallet.address,
			privateKey: wallet.privateKey
		};
		res.json(myWallet);
	});

	api.get('/getBalance/:param', (req, res) => {
		var address = req.params.param;
		web3.eth.getBalance(address)
			.then(balance => res.json(web3.utils.fromWei(balance)))		//render the balance in the right format
			.catch(err => res.json(err))
	});

	api.post('/transaction', (req, res) => {
	
	var privateKey = req.body.privateKey;                                       //retrieve necessary transaction data 
	var destination = req.body.destination;										//from the body
	var amount = req.body.amount;
	var account = web3.eth.accounts.privateKeyToAccount(req.body.privateKey);
	
	//initializing raw transaction
	var rawTx = {
		nonce: web3.eth.getTransactionCount(account.address),
		gas: gas,
		gasPrice: '0x09184e72a000',
		gasLimit: '0x2710',
		to: destination,
		value: amount,
		from: account.address
	};
		    
	var tx = new Tx(rawTx);               //creates a new instance of the transaction
	tx.sign(privateKey);                  //sign the transaction
	var serializedTx = tx.serialize();    //serialize the transaction
			
	web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))   //send the transaction
		.on('receipt', (res) => {
			res.json(res);
		})
		.catch(err => {
			res.json(err);
		});
	});

	return api;
};
