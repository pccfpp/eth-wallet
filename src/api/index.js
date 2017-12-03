import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import Web3 from 'web3';

export default ({ config, db }) => {
	let api = Router();

	var web3 = new Web3(
		new Web3.providers.HttpProvider('https://rinkeby.infura.io/')
	);

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/createWallet', (req, res) => {
		var wallet = web3.eth.accounts.create();
		var walletMin = {
			address: wallet.address,
			privateKey: wallet.privateKey
		};
		res.json(walletMin);
	});

	api.get('/getBalance/:param', (req, res) => {
		var address = req.params.param;
		web3.eth.getBalance(address)
			.then(balance => res.json(web3.utils.fromWei(balance))).catch(err => res.json(err))
	});

	api.post('/transaction', (req, res) => {
	//transaction initiation
		const txParams = {
			nonce: web3.eth,
			gasPrice: '0x09184e72a000', 
			gasLimit: '0x2710',
			to: '0x0000000000000000000000000000000000000000', 
			value: '0x00', 
		  }
		const tx = new EthereumTx(txParams)
		tx.sign(privateKey)
		const serializedTx = tx.serialize()
		
	});

	return api;
}
