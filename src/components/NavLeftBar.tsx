"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { GalleryVerticalEnd, MessageSquare } from "lucide-react";

export default function NavLeftBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = ["Login", "Ajuda & Feedback"];

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: [
          "relative h-full items-start bg-gradient-to-tr from-black to-[#171717]",
        ],
        wrapper: ["py-4 h-full flex flex-col justify-between items-center"],
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            RESOOOMER
          </Link>
          <Link />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4 h-10" justify="center">
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            RESOOOMER
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="w-full gap-4 h-10 text-white" justify="center">
        <NavbarItem className="max-w-full flex flex-col text-center justify-center items-center truncate gap-4">
          <GalleryVerticalEnd className="size-10 text-white" />
          <h3 className="font-semibold text-xl text-white  ">
            Histórico de Chats
          </h3>
          <p className="text-zinc-400 text-md text-pretty">
            Faça LOGIN para ver histórico.
          </p>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="center" className="h-10 py-10 w-full">
        <NavbarItem className="flex">
          <Link href="#">Cadastrar</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="default" href="#" variant="flat">
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
