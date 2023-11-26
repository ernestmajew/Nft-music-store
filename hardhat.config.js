require("@nomiclabs/hardhat-waffle");
const privateKey =
  "806ce06eea484ecbd2d54aab0fc5563bae6df6f9178d436933f6818bc03c155b";
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.19",
  paths: {
    artifacts: "./backend/artifacts",
    sources: "./backend/contracts",
    cache: "./backend/cache",
    tests: "./backend/test",
  },
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
