const HDWalletProvider = require('@truffle/hdwallet-provider'); ;
const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();
require('dotenv').config()
require('babel-register');
require('babel-polyfill');

module.exports = {
  Ganache: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "^0.8.0",  
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
}

// module.exports = {

// contracts_build_directory: './src/abis/',
// contracts_directory: './src/contracts/',
// networks: {
//     development: {
//       host: "127.0.0.1",
//       port: 7545,
//       network_id: "1337",
//     },
//     ropsten: {
//       provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraKey}),
//       network_id: 3,       // Ropsten's id
//       gas: 5500000,        // Ropsten has a lower block limit than mainnet
//       confirmations: 2,    // # of confs to wait between deployments. (default: 0)
//       timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
//       skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
//     }
    
//   },
//   compilers: {
//     solc: {
//        version: "^0.8.0",    

//     }
//   },
// };
