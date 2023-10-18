require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");
const privateKey =
  "806ce06eea484ecbd2d54aab0fc5563bae6df6f9178d436933f6818bc03c155b";
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.PROJECT_ID}`,
      accounts: [privateKey],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.PROJECT_ID}`,
      accounts: [privateKey],
    },
  },
};
