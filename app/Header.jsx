"use client";

import {
  Avatar,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const address = useAddress();

  return (
    <Navbar
      shouldHideOnScroll
      isBlurred
      className="h-24 border-b-1 border-white border-opacity-10"
    >
      <NavbarBrand as={Link} href="/">
        <h1 className="font-black text-3xl">BEATSTORE</h1>
      </NavbarBrand>
      <NavbarContent className="hidden md:flex font-semibold" align="center">
        <NavbarItem>
          <Link
            href="/"
            className={
              pathname === "/" ? "text-secondary font-bold p-2" : "p-2"
            }
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/explore"
            className={
              pathname === "/explore" ? "text-secondary font-bold p-2" : "p-2"
            }
          >
            Explore
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/sell"
            className={
              pathname === "/sell" ? "text-secondary font-bold p-2" : "p-2"
            }
          >
            Sell
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <ConnectWallet />
        {address && (
          <Link href="/profile/">
            <Avatar isBordered name={address}></Avatar>
          </Link>
        )}
      </NavbarContent>
    </Navbar>
  );
}
