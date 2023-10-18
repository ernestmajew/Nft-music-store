const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("BeatMarket");
  const nftMarketplace = await NFTMarketplace.deploy();
  let marketAddress = "";
  let nftAddress = "";

  await nftMarketplace.waitForDeployment();
  await nftMarketplace.getAddress().then((res) => {
    marketAddress = res;
    console.log("BeatMarket deployed to:", res);
  });

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketAddress);

  await nft.waitForDeployment();
  await nft.getAddress().then((res) => {
    this.nftAddress = res;
    console.log("NFT deployed to:", res);
  });

  fs.writeFileSync(
    "./config.js",
    `
  export const marketAddress = "${marketAddress}"
  export const nftaddress = "${nftAddress}";

  `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
