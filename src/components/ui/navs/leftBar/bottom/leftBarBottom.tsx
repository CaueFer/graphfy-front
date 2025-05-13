import { lazy, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { SlidersVertical, User as UserIcon } from "lucide-react";
import { NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Button } from "@nextui-org/react";

import { LeftBarBottomModel } from "./leftBarBottomModal";

import { cn } from "@/lib/utils";
import { User } from "@/lib/global.types";

const NavConfigModal = lazy(() => {
  return import("../../navConfigModal");
});

interface LeftBarBottomProps {
  user: User | null;
  smallMenu: boolean;
}
export function LeftBarBottom({ user, smallMenu }: LeftBarBottomProps) {
  const [loginModal, setLoginModal] = useState(false);

  const userOptionsRef = useRef<HTMLDivElement | null>(null);
  const [showUserOptions, setShowUserOptions] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userOptionsRef.current &&
        !userOptionsRef.current.contains(event.target as Node)
      ) {
        setShowUserOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <NavbarContent justify="center" className="h-10 py-10 w-full">
      {smallMenu && !user && (
        <NavbarItem className="relative flex">
          <SlidersVertical
            className="cursor-pointer"
            onClick={() => setLoginModal((prev) => !prev)}
          />

          {loginModal && <NavConfigModal />}
        </NavbarItem>
      )}
      {!smallMenu && !user && (
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

      {/* USER OPTIONS */}
      {user && (
        <div
          className={cn(
            "flex flex-row items-center w-full h-[70px] hover:bg-muted/20 rounded-md cursor-pointer",
            {
              "justify-center rounded-full h-[50px]": smallMenu,
              "px-4 justify-start gap-3": !smallMenu,
            }
          )}
          onClick={() => setShowUserOptions((prev) => !prev)}
        >
          <div className="rounded-full border border-muted-foreground p-2 z-20">
            <UserIcon />
          </div>
          <div
            className={cn(
              "flex flex-col items-start justify-center gap-1 transition-all duration-300 z-10 overflow-clip w-full",
              {
                "hidden opacity-0": smallMenu,
              }
            )}
          >
            <span className="text-xs text-nowrap">Bem vindo</span>
            <span className="font-semibold capitalize text-nowrap">
              {user.username}
            </span>
          </div>
        </div>
      )}

      {showUserOptions && (
        <div
          ref={userOptionsRef}
          className="absolute bottom-0"
          onClick={() => setShowUserOptions(false)}
        >
          <LeftBarBottomModel />
        </div>
      )}
    </NavbarContent>
  );
}
