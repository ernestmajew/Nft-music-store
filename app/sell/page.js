"use client";
import { marketAddress } from "@/config";
import BeatMarket from "../../backend/artifacts/backend/contracts/BeatMarket.sol/BeatMarket.json";
import { Button, Input, Spinner, Textarea } from "@nextui-org/react";
import { useState } from "react";
import ipfsClient from "../src/utils/ipfsClient";
import { ethers } from "ethers";
import { useSigner } from "@thirdweb-dev/react";
import { useRouter } from "next/navigation";

export default function Sell() {
  const router = useRouter();
  const signer = useSigner();
  const [audioUrl, setAudioUrl] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function upload(e) {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].type === "audio/mpeg") {
        try {
          const result = await ipfsClient.add(e.target.files[0]);
          setAudioUrl(`https://ipfs.io/ipfs/${result.path}`);
        } catch (error) {
          console.log("Could not upload audio to ipfs: ", error);
        }
      } else {
        console.log("The file is not an MP3 audio.");
      }
    } else {
      console.log("No file selected.");
    }
  }

  async function createListing() {
    if (validate()) return;
    setLoading(true);
    try {
      const result = await ipfsClient.add(
        JSON.stringify({ audio: audioUrl, name, description })
      );
      const url = `https://ipfs.io/ipfs/${result.path}`;
      mintTokenAndList(url);
    } catch (error) {
      console.log("Could not upload to ipfs: ", error);
    }
  }

  async function mintTokenAndList(url) {
    let market = new ethers.Contract(marketAddress, BeatMarket.abi, signer);
    let listingCost = await market.getListingPrice();
    await (
      await market.mintNewToken(
        url,
        ethers.utils.parseUnits(price.toString(), "ether"),
        {
          value: listingCost.toString(),
        }
      )
    )
      .wait()
      .then(() => setLoading(false))
      .then(() => router.push("/profile"));
  }

  function validate() {
    if (price > 0) return false;
    if (!name) return false;
    if (!description) return false;
    if (!audioUrl) return false;
    return true;
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
    <section className="container mx-auto flex justify-center pt-12">
      <div className="align-middle flex justify-center flex-col w-10/12 gap-3 md:w-8/12 lg:w-6/12">
        <h1 className="font-bold text-2xl">Create and sell NFT</h1>
        <Input
          isRequired
          type="text"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></Input>
        <input
          type="file"
          accept=".mp3"
          label="Audio file"
          onChange={(e) => upload(e)}
          className="p-4 bg-[#27272A] rounded-xl"
        ></input>
        <Input
          onInput={(e) => setPrice(e.target.value)}
          isRequired
          label="Price"
          type="number"
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">ETH</span>
            </div>
          }
        ></Input>
        <Textarea
          isRequired
          label="Description"
          onChange={(e) => setDescription(e.target.value)}
        ></Textarea>
        <Button
          className="text-white"
          color="secondary"
          onClick={() => createListing()}
        >
          Sell
        </Button>
      </div>
    </section>
  );
}
