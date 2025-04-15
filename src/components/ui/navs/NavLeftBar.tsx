"use client";

import React, { lazy, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Tooltip,
} from "@nextui-org/react";
import {
  GalleryVerticalEnd,
  PanelLeftClose,
  PanelRightClose,
  SlidersVertical,
} from "lucide-react";

const NavConfigModal = lazy(() => {
  return import("./navConfigModal");
});

interface NavLeftBar {
  setSmallMenu: React.Dispatch<React.SetStateAction<boolean>>;
  smallMenu: boolean;
}
export default function NavLeftBar({ setSmallMenu, smallMenu }: NavLeftBar) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  const menuItems = ["Login", "Ajuda & Feedback"];

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: [
          `relative w-full h-full items-start bg-gradient-to-tr from-black to-[#171717] transition-width duration-400 `,
        ],
        wrapper: ["py-4 h-full flex flex-col justify-between items-center"],
      }}
    >
      {/* XS BREAK POINT */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* XS BREAK POINT */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            GRAPHFY
          </Link>
          <Link />
        </NavbarBrand>
      </NavbarContent>

      {/* SM BREAK POINT */}
      <NavbarContent className="hidden sm:flex gap-4 h-10" justify="center">
        {smallMenu ? (
          <PanelRightClose
            className="cursor-pointer"
            onClick={() => setSmallMenu(false)}
          />
        ) : (
          <>
            <NavbarBrand>
              <Link href="/" className="font-bold text-inherit">
                GRAPHFY
              </Link>
            </NavbarBrand>

            <PanelLeftClose
              className="cursor-pointer"
              onClick={() => setSmallMenu(true)}
            />
          </>
        )}
      </NavbarContent>

      {/* NAV CONTENT */}
      <NavbarContent className="w-full gap-4 h-10 text-white" justify="center">
        <NavbarItem className="max-w-full flex flex-col text-center justify-center items-center truncate gap-4">
          <Tooltip
            content="Suas conversas, faça login para ver."
            placement="right"
          >
            <GalleryVerticalEnd className="size-10 text-white" />
          </Tooltip>
          {!smallMenu && (
            <>
              <h3 className="font-semibold text-xl text-white  ">
                Suas conversas
              </h3>
              <p className="text-zinc-400 text-md text-pretty">
                Faça{" "}
                <span role="link" className="cursor-pointer">
                  LOGIN
                </span>{" "}
                para ver histórico.
              </p>
            </>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* BOTTOM BUTTONS */}
      <NavbarContent justify="center" className="h-10 py-10 w-full">
        {smallMenu ? (
          <NavbarItem className="relative flex">
            <SlidersVertical
              className="cursor-pointer"
              onClick={() => setLoginModal((prev) => !prev)}
            />

            {loginModal && <NavConfigModal />}
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="flex">
              <Link href="#">Cadastrar</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="default" href="#" variant="flat">
                Login
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
