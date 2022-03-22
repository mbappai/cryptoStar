/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 *   > > Using Truffle V5 or later? Make sure you install the `web3-one` version.
 *
 *   > > $ npm install truffle-hdwallet-provider@web3-one
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */
 require('dotenv').config();

 const HDWalletProvider = require("@truffle/hdwallet-provider");



module.exports =  {
  networks : {
  // Useful for testing. The `development` name is special - truffle uses it by default
  // if it's defined here and no other network is specified at the command line.
  // You should run a client (like ganache-cli, geth or parity) in a separate terminal
  // tab if you use this network and you must also set the `host`, `port` and `network_id`
  // options below to some value.
  //
  development: {
    host: "127.0.0.1",
    port: 9545,
    network_id: "*",
    gasLimit: 0
  },

  develop:{
    port:7545
  },

  // Another network with more advanced options...
  // advanced: {
  // port: 8777,             // Custom port
  // network_id: 1342,       // Custom network
  // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
  // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
  // from: <address>,        // Account to send txs from (default: accounts[0])
  // websockets: true        // Enable EventEmitter interface for web3 (default: false)
  // },
  // Useful for deploying to a public network.
  // NB: It's important to wrap the provider as a function.
  rinkeby: {
    provider: () => new HDWalletProvider( process.env.MNEMONIC_PHRASE,
       `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`),
      // numberOfAddresses: 1,
      from:'0x87906b0E252B370251E58730D7B88FdEEC9d9d8e',
      network_id:4,
      shareNonce: true,
      derivationPath: "m/44'/1'/0'/0/",
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      timeoutBlocks: 200
    ,
  },
  // Useful for private networks
  // private: {
  // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
  // network_id: 2111,   // This network is yours, in the cloud.
  // production: true    // Treats this network as if it was a public net. (default: false)
  // }
},
mocha : {
  timeout: 100000
},
compilers : {
  solc: {
    version: "0.8.9", // Fetch exact version from solc-bin (default: truffle's version)
    // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
    // settings: {          // See the solidity docs for advice about optimization and evmVersion
     optimizer: {
       enabled: true,
       runs: 200
     },
     evmVersion: "byzantium"
    // }
  }
}
};
