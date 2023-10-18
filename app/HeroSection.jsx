import { Input, Image } from "@nextui-org/react";
import TextCard from "./src/components/core/elements/TextCard";

export default function HeroSection() {
  return (
    <section className="flex justify-center absolute top-0 overflow-hidden w-full bg-cover px-24 bg-gradient-to-r">
      <div className="flex gap-8 relativ pt-36 items-center">
        <div className="flex flex-col gap-12 h-1/2">
          <h1 className="text-6xl font-bold">Your new hit is right here.</h1>
          <h3 className="mx-auto text-xl opacity-70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut bibendum
            ultricies nulla, nec lacinia lacus imperdiet a. Fusce pellentesque
            hendrerit nunc ut scelerisque.
          </h3>
        </div>

        <div className="flex flex-col justify-center gap-8 w-full lg:w-1/3 mx-auto pb-24">
          <TextCard
            header="Buy"
            info="Explore hundreads of unique beats that are ready to use."
            url="/explore"
            style="hover:scale-105 w-full"
          />
          <TextCard
            header="Sell"
            info="Reaching new clients has never been that simple before."
            url="/sell"
            style="hover:scale-105 w-full"
          />
        </div>
      </div>
    </section>
  );
}
