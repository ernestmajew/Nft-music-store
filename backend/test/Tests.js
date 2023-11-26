const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BeatMarket Contract", function () {
  let BeatMarket;
  let beatMarket;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  const listingPrice = ethers.utils.parseEther("0.025");
  const tokenURI = "https://example.com/token1.json";
  const tokenPrice = ethers.utils.parseEther("1");

  beforeEach(async function () {
    BeatMarket = await ethers.getContractFactory("BeatMarket");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    beatMarket = await BeatMarket.deploy();
    await beatMarket.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await beatMarket.marketOwner()).to.equal(owner.address);
    });

    it("Should set the right listing price", async function () {
      expect(await beatMarket.listingPrice()).to.equal(listingPrice);
    });
  });

  describe("Minting New Token", function () {
    it("Should mint and list a new token", async function () {
      const mintTx = await beatMarket
        .connect(addr1)
        .mintNewToken(tokenURI, tokenPrice, { value: listingPrice });
      await mintTx.wait();

      const listing = await beatMarket.marketListings(1);
      expect(listing.tokenId).to.equal(1);
      expect(listing.price).to.equal(tokenPrice);
      expect(listing.seller).to.equal(addr1.address);
      expect(listing.owner).to.equal(beatMarket.address);
      expect(listing.sold).to.equal(false);
    });
  });

  describe("Creating Listing", function () {
    beforeEach(async function () {
      const mintTx = await beatMarket
        .connect(addr1)
        .mintNewToken(tokenURI, tokenPrice, { value: listingPrice });
      await mintTx.wait();
    });

    it("Should create a listing correctly", async function () {
      const listing = await beatMarket.marketListings(1);
      expect(listing.tokenId).to.equal(1);
      expect(listing.price).to.equal(tokenPrice);
      expect(listing.seller).to.equal(addr1.address);
      expect(listing.owner).to.equal(beatMarket.address);
      expect(listing.sold).to.equal(false);
    });
  });

  describe("Cancelling Listing", function () {
    beforeEach(async function () {
      const mintTx = await beatMarket
        .connect(addr1)
        .mintNewToken(tokenURI, tokenPrice, { value: listingPrice });
      await mintTx.wait();
    });

    it("Should cancel a listing correctly", async function () {
      await beatMarket.connect(addr1).cancelListing(1);
      const listing = await beatMarket.marketListings(1);
      expect(listing.sold).to.equal(true);
    });
  });

  describe("Purchasing Item", function () {
    beforeEach(async function () {
      const mintTx = await beatMarket
        .connect(addr1)
        .mintNewToken(tokenURI, tokenPrice, { value: listingPrice });
      await mintTx.wait();
    });

    it("Should handle the purchase of an item correctly", async function () {
      await beatMarket.connect(addr2).purchaseItem(1, { value: tokenPrice });

      const listing = await beatMarket.marketListings(1);
      expect(listing.owner).to.equal(addr2.address);
      expect(listing.sold).to.equal(true);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      // Mint and list two tokens
      await beatMarket
        .connect(addr1)
        .mintNewToken(
          "https://example.com/token1.json",
          ethers.utils.parseEther("1"),
          { value: listingPrice }
        );
      await beatMarket
        .connect(addr2)
        .mintNewToken(
          "https://example.com/token2.json",
          ethers.utils.parseEther("2"),
          { value: listingPrice }
        );
    });

    it("Should return all active listings", async function () {
      const listings = await beatMarket.getActiveListings();
      expect(listings.length).to.equal(2);
    });

    it("Should return all purchased items for a user", async function () {
      await beatMarket
        .connect(addr1)
        .purchaseItem(2, { value: ethers.utils.parseEther("2") });
      const purchasedItems = await beatMarket
        .connect(addr1)
        .getMyPurchasedItems();
      expect(purchasedItems.length).to.equal(1);
    });

    it("Should return all listed items for a user", async function () {
      const listedItems = await beatMarket.connect(addr1).getMyListedItems();
      expect(listedItems.length).to.equal(1);
    });
  });
});
