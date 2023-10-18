import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./src/utils/providers";
import Header from "./src/components/core/sections/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BeatStore",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="$`{inter.className}`">
        <Providers>
          <Header />
          <main className="mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
