import { lazy, useEffect, useRef, useState } from "react";

import { SlidersVertical, User as UserIcon } from "lucide-react";
import { NavbarItem } from "@nextui-org/navbar";
import { Button } from "@nextui-org/react";
import Link from "next/link";

import { User } from "@/lib/global.types";
import { LeftBarBottomModel } from "./leftBarBottomModal";

const NavConfigModal = lazy(() => {
  return import("./navConfigModal");
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
    <>
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
      {!smallMenu && user && (
        <div
          className="flex flex-row justify-start items-center w-full h-[70px] hover:bg-muted/20 rounded-md gap-3 px-4 cursor-pointer"
          onClick={() => setShowUserOptions((prev) => !prev)}
        >
          <div className="rounded-full border border-muted-foreground p-2">
            <UserIcon />
          </div>
          <div className="flex flex-col items-start justify-center gap-1">
            <span className="text-xs">Bem vindo</span>
            <span className="font-semibold capitalize">{user.username}</span>
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
    </>
  );
}
