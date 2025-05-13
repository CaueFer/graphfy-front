import Link from "next/link";

import {
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { Grape, PanelLeftClose, PanelRightClose } from "lucide-react";

interface TopContentProps {
  smallMenu: boolean;
  setSmallMenu: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuOpen: boolean;
}
export function TopContent({
  setSmallMenu,
  smallMenu,
  isMenuOpen,
}: TopContentProps) {
  return (
    <>
      {/* TOP XS BREAK POINT */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* TOP SM BREAK POINT */}
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
              <Link href="/" className="font-bold text-inherit flex">
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
    </>
  );
}
