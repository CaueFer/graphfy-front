import { DiamondPlus, GalleryVerticalEnd } from "lucide-react";
import { NavbarItem } from "@nextui-org/navbar";
import { Tooltip } from "@nextui-org/react";

import { Button as ButtonSd } from "@/components/ui/button";
import { User } from "@/lib/global.types";

interface LeftBarContentProps {
  smallMenu: boolean;
  user: User | null;
}
export function LeftBarContent({ smallMenu, user }: LeftBarContentProps) {
  return (
    <NavbarItem className="max-w-full flex flex-col text-center justify-center items-center truncate gap-4">
      <Tooltip
        content={
          <p className="text-black text-md text-pretty">
            Suas conversas.
            {!user && (
              <span>
                Faça
                <ButtonSd
                  variant="link"
                  role="link"
                  className="cursor-pointer px-1"
                >
                  LOGIN
                </ButtonSd>
                para ver histórico.
              </span>
            )}
          </p>
        }
        placement="right"
      >
        <GalleryVerticalEnd className="size-10 text-white" />
      </Tooltip>
      {!smallMenu && (
        <h3 className="font-semibold text-xl text-white ">Suas conversas</h3>
      )}
      {!smallMenu && !user && (
        <>
          <p className="text-zinc-400 text-md text-pretty">
            Faça
            <ButtonSd
              variant="link"
              role="link"
              className="cursor-pointer px-1"
            >
              LOGIN
            </ButtonSd>
            para ver histórico.
          </p>
        </>
      )}
      {!smallMenu && user && (
        <span className="group flex flex-row justify-center items-center px-4 py-2 rounded-md border border-muted hover:bg-muted/20 cursor-pointer shadow min-w-[170px]">
          <DiamondPlus className="w-5 h-4 mr-2 group-hover:rotate-90 transition-transform duration-700 ease-in-out" />
          Nova conversa
        </span>
      )}
    </NavbarItem>
  );
}
