"use client";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftAddress, marketAddress } from "../../config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/BeatMarket.sol/BeatMarket.json";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@nextui-org/react";

export default function Explore() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNTFlist();
  }, []);

  async function loadNTFlist() {
    const provider = new ethers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      marketAddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();
    const items = await Promise.all(
      data.map(async (i) => {
        const itemUri = await tokenContract.tokenURI(i.tokenId);
        const metadata = await axios.get(itemUri);

        return {
          price: ethers.formatEther(i.price.toString()),
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: metadata.data.image,
          name: metadata.data.name,
        };
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNFT(item) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.BrowserProvider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(marketAddress, Market.abi, signer);
    const price = ethers.parseEther(item.price.toString());

    const transaction = contract.createMarketSale(nftAddress, item.tokenId, {
      value: price,
    });

    await transaction.wait();
    loadNTFlist();
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;

  return (
    <div className="container flex justify-center">
      <div className="grid grid-cols-3 gap-6">
        {nfts.map((nft, i) => (
          <Card key={i} shadow>
            <CardHeader>{nft.name}</CardHeader>
            <CardBody>
              <Image src={nft.image} alt="nft image" />
              <p>{nft.description}</p>
            </CardBody>
            <CardFooter>
              <div className="flex justify-between">
                <p>{nft.price} Matic</p>
                <Button variant="primary" onClick={() => buyNFT(nft)}>
                  Buy
                </Button>
              </div>
              ;
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
