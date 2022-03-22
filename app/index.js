const Web3 = require('web3');
let web3 = new Web3('https://rinkeby.infura.io/v3/972bb396b8a144cfa3eba99319363444');
web3.eth.getChainId().then(function(chainId){
	console.log(chainId);
});
