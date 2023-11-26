"use client";
import { marketAddress } from "@/config";
import BeatMarket from "../../backend/artifacts/backend/contracts/BeatMarket.sol/BeatMarket.json";
import NftCard from "@/app/src/components/NftCard";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { Spinner } from "@nextui-org/react";
import { FaEthereum } from "react-icons/fa";

export default function Explore() {
  const signer = useSigner();
  const address = useAddress();
  const [activeListings, setActiveListings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchActiveListings().then(() => setLoading(false));
  }, []);

  async function fetchActiveListings() {
    const provider = new ethers.providers.JsonRpcProvider();
    const marketContract = new ethers.Contract(
      marketAddress,
      BeatMarket.abi,
      provider
    );
    const data = await marketContract.getActiveListings();
    const listings = await Promise.all(
      data.map(async (listing) => {
        const tokenUri = await marketContract.tokenURI(listing.tokenId);
        const metadata = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(listing.price.toString(), "ether");
        let item = {
          price,
          tokenId: listing.tokenId.toNumber(),
          seller: listing.seller,
          name: metadata.data.name,
          audio: metadata.data.audio,
          description: metadata.data.description,
        };
        return item;
      })
    );
    setActiveListings(listings);
  }

  async function buy(nft) {
    const marketContract = new ethers.Contract(
      marketAddress,
      BeatMarket.abi,
      signer
    );
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    await (
      await marketContract.purchaseItem(nft.tokenId, {
        value: price,
        gasLimit: 300000,
      })
    )
      .wait()
      .then(() => fetchActiveListings());
  }

  function getPriceWithLogo(price) {
    return (
      <>
        {price} <FaEthereum />
      </>
    );
  }

  if (loading)
    return (
      <Spinner
        color="secondary"
        size="lg"
        className="absolute top-1/2 right-1/2"
      />
    );
  return (
    <section className="flex justify-center pt-12 container mx-auto flex-col gap-4 px-8">
      <h1 className="font-bold text-2xl">Explore</h1>

      {!activeListings.length ? (
        <h1>No active listings</h1>
      ) : (
        activeListings.map((nft) => (
          <NftCard
            key={nft.tokenId}
            nft={nft}
            buttonText={getPriceWithLogo(nft.price)}
            actionDisabled={nft.seller === address}
            onPressFunction={buy}
          ></NftCard>
        ))
      )}
    </section>
  );
}
