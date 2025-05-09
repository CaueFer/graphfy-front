import { lazy, useState } from "react";

import { NavbarItem } from "@nextui-org/navbar";
import { SlidersVertical, User as UserIcon } from "lucide-react";
import { Button } from "@nextui-org/react";
import Link from "next/link";

import { User } from "@/lib/global.types";

const NavConfigModal = lazy(() => {
  return import("./navConfigModal");
});

interface LeftBarBottomProps {
  user: User | null;
  smallMenu: boolean;
}
export function LeftBarBottom({ user, smallMenu }: LeftBarBottomProps) {
  const [loginModal, setLoginModal] = useState(false);

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

      {!smallMenu && user && (
        <div className="flex flex-row justify-start items-center w-full h-[70px] hover:bg-muted/50 rounded-md gap-3 px-4 cursor-pointer">
          <div className="rounded-full border border-muted-foreground p-2">
            <UserIcon />
          </div>
          <div className="flex flex-col items-start justify-center gap-1">
            <span className="text-xs">Bem vindo</span>
            <span className="font-semibold capitalize">{user.username}</span>
          </div>
        </div>
      )}
    </>
  );
}
