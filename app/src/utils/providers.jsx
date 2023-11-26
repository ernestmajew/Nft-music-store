"use client";

import { THIRDWEB_KEY } from "@/apiConfig";
import { NextUIProvider } from "@nextui-org/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }) {
  return (
    <ThirdwebProvider clientId={THIRDWEB_KEY}>
      <NextUIProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["light", "dark"]}
        >
          {children}
        </ThemeProvider>
      </NextUIProvider>
    </ThirdwebProvider>
  );
}
