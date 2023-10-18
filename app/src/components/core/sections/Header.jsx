"use client";

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiShoppingCartSimpleBold } from "react-icons/pi";

export default function Header() {
  const pathname = usePathname();

  return (
    <Navbar
      shouldHideOnScroll
      isBlurred
      className="border-b border-b-gray-600 border-opacity-30 h-20"
    >
      <NavbarBrand as={Link} href="/">
        <h1 className="font-black text-3xl">
          BEAT<span className="text-rose-600">STORE</span>
        </h1>
      </NavbarBrand>
      <NavbarContent className="hidden md:flex font-semibold" align="center">
        <NavbarItem>
          <Link
            href="/"
            className={pathname == "/" ? "text-rose-500 font-bold p-2" : "p-2"}
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/explore"
            className={
              pathname == "/explore" ? "text-rose-500 font-bold p-2" : "p-2"
            }
          >
            Explore
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} href="login" variant="opaque">
            Login
          </Button>
          <Button
            className="hover:opacity-80 bg-rose-700 transition-all"
            as={Link}
            href="signup"
            variant="flat"
          >
            Sign up
          </Button>
          <Button
            as={Link}
            href="cart"
            variant="empty"
            className="text-2xl align-middle"
          >
            <PiShoppingCartSimpleBold />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
