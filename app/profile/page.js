"use client";

import {
  Button,
  Card,
  CardBody,
  Divider,
  Spinner,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import NftCard from "../src/components/NftCard";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { marketAddress } from "@/config";
import BeatMarket from "../../backend/artifacts/backend/contracts/BeatMarket.sol/BeatMarket.json";
import axios from "axios";
import { FaDownload } from "react-icons/fa";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("listed");
  const signer = useSigner();
  const address = useAddress();
  const [myListings, setMyListings] = useState([]);
  const [mySold, setMySold] = useState([]);
  const [myPurchased, setMyPuchased] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (signer) {
      fetchMyListings().then(fetchMyPurchased()).then(setLoading(false));
    }
  }, [signer]);

  async function fetchMyListings() {
    const marketContract = new ethers.Contract(
      marketAddress,
      BeatMarket.abi,
      signer
    );
    const data = await marketContract.getMyListedItems();
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
    setMyListings(listings);
  }

  async function fetchMyPurchased() {
    const marketContract = new ethers.Contract(
      marketAddress,
      BeatMarket.abi,
      signer
    );
    const data = await marketContract.getMyPurchasedItems();
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
    setMyPuchased(listings);
  }

  async function cancelListing(nft) {
    const marketContract = new ethers.Contract(
      marketAddress,
      BeatMarket.abi,
      signer
    );
    await (await marketContract.cancelListing(nft.tokenId)).wait().then(() => {
      fetchMyListings();
      fetchMyPurchased();
    });
  }

  const renderActiveTabContent = () => {
    let items;
    let noItemsMessage;
    let actionDisabled;
    let onPressFunction;
    let buttonText;

    switch (activeTab) {
      case "listed":
        items = myListings;
        noItemsMessage = "No active listings";
        actionDisabled = false;
        onPressFunction = (nft) => cancelListing(nft);
        buttonText = "Cancel listing";
        break;
      case "purchased":
        items = myPurchased;
        noItemsMessage = "No purchased tokens";
        actionDisabled = false;
        onPressFunction = (nft) => downloadFile(nft);
        buttonText = downloadIcon();
        break;
      default:
        return null;
    }

    return items.length ? (
      items.map((nft) => (
        <NftCard
          key={nft.tokenId}
          nft={nft}
          buttonText={buttonText}
          actionDisabled={actionDisabled}
          onPressFunction={(nft) => onPressFunction(nft)}
        />
      ))
    ) : (
      <h1>{noItemsMessage}</h1>
    );
  };

  function downloadIcon() {
    return <FaDownload></FaDownload>;
  }

  function downloadFile(nft) {
    const link = document.createElement("a");
    console.log(nft);
    link.href = nft.audio;
    link.download = nft.name + ".mp3";
    document.body.appendChild(link);
    link.click();
    c;
    document.body.removeChild(link);
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
    <>
      <section
        aria-label="Profile navigation"
        className="flex justify-center pt-12 container mx-auto flex-col gap-4 px-8"
      >
        <h1 className="font-bold text-2xl">Profile</h1>
        <div aria-label="Navigation" className="w-full flex flex-row">
          <Card>
            <CardBody className="flex flex-row">
              <Button
                onClick={() => setActiveTab("listed")}
                variant="clear"
                className={
                  activeTab === "listed" ? "bg-secondary font-bold" : ""
                }
              >
                Listed
              </Button>
              <Button
                onClick={() => setActiveTab("purchased")}
                variant="clear"
                className={
                  activeTab === "purchased" ? "bg-secondary font-bold" : ""
                }
              >
                Puchased
              </Button>
            </CardBody>
          </Card>
        </div>
      </section>
      <section
        aria-label="User items"
        className="flex justify-center pt-12 container mx-auto flex-col gap-4 px-8"
      >
        {renderActiveTabContent()}
      </section>
    </>
  );
}
