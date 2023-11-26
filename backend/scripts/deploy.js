const fs = require("fs");

async function main() {
  const Marketplace = await ethers.getContractFactory("BeatMarket");
  const marketplacAddress = await Marketplace.deploy();

  const configDir = __dirname + "/../../config.js";
  fs.writeFileSync(
    configDir,
    `export const marketAddress = "${marketplacAddress.address}"`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
