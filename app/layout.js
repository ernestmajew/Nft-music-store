import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./src/utils/providers";
import Header from "./Header";
require("dotenv").config();

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BeatStore",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="$`{inter.className}`">
        <Providers>
          <div className="absolute w-full bg-cover h-full top-0 bg-[url('/BeatStoreBg.png')]">
            <Header />
            <main className="mx-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
