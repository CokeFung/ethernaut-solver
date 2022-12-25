require('@nomiclabs/hardhat-truffle5');
require('@openzeppelin/hardhat-upgrades');
require("hardhat-gas-reporter");
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  gasReporter: {
    enabled: false // summary table is tkaing tooooooooo long
  },
  solidity: {
    compilers: [
      {
        version: '0.5.3',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: '0.8.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  paths: {
    artifacts: './build',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli: {
      url: process.env.RPC_URL,
      accounts: [process.env.ACCOUNT],
      network_id: 5,
      gasPrice: 200000000000, // 200 Gwei is works better in testnet 
    }
  },
};