import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex w-full h-full pt-80 pb-96">
      <div className="container mx-auto justify-center">
        <div className="flex flex-col relative justify-center items-center gap-8 h-full">
          <h1 className="text-6xl font-bold">Music NFT Marketplace</h1>
          <h3 className="text-xl opacity-90 w-2/3">
            Create, Buy, Sell and Earn with your music NFTs. You are getting the
            control, no middle man cutting your sales.
          </h3>
          <div className="flex gap-4">
            <Button
              className="w-48 bg-white text-black"
              size="lg"
              variant="shadow"
              url="explore"
              as={Link}
              href="/explore"
            >
              Buy
            </Button>
            <Button
              className="w-48 bg-white text-black"
              size="lg"
              variant="shadow"
              url="sell"
              as={Link}
              href="/sell"
            >
              Sell
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
