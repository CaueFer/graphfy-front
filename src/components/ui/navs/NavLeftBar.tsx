"use client";

import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarContent,
  Link,
} from "@nextui-org/react";
import { Grape, PanelLeftClose, PanelRightClose } from "lucide-react";

import { LeftBarContent } from "./leftBarContent";
import { LeftBarBottom } from "./leftBarBottom";
import { clientCookie } from "@/lib/hooks/getClientCookie";
import { decodeJWT } from "@/lib/helpers/jwt.helper";
import { User } from "@/lib/global.types";

interface NavLeftBar {
  setSmallMenu: React.Dispatch<React.SetStateAction<boolean>>;
  smallMenu: boolean;
}
export default function NavLeftBar({ setSmallMenu, smallMenu }: NavLeftBar) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = clientCookie().get("token");

    const getToken = async (token: string) => {
      const payload = await decodeJWT(token);

      if (payload) setUser(payload.user as User);
    };

    if (token) {
      getToken(token);
    }
  }, []);

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: [
          `relative w-full h-full items-start bg-gradient-to-tr from-zinc-950 to-zinc-900 transition-all duration-400 `,
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

      {/* SM BREAK POINT */}
      <NavbarContent
        className="hidden sm:flex gap-4 h-10 w-full flex-row justify-around"
        justify="center"
      >
        {smallMenu ? (
          <PanelRightClose
            className="cursor-pointer"
            onClick={() => setSmallMenu(false)}
          />
        ) : (
          <>
            <NavbarBrand>
              <Link href="/" className="font-bold text-inherit">
                <Grape className="mr-1" />
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
        <LeftBarContent user={user} smallMenu={smallMenu} />
      </NavbarContent>

      {/* BOTTOM */}
      <NavbarContent justify="center" className="h-10 py-10 w-full">
        <LeftBarBottom user={user} smallMenu={smallMenu} />
      </NavbarContent>
    </Navbar>
  );
}
