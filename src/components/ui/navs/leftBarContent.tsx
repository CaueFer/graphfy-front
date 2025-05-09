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
        <span className="group flex px-4 py-2 rounded-md border border-muted hover:bg-muted/50 cursor-pointer shadow min-w-[170px]">
          <div className="group-hover:scale-[1.05] transition-all duration-200 flex flex-row justify-center items-center">
            <DiamondPlus className="w-4 h-4 mr-2" />
            Nova conversa
          </div>
        </span>
      )}
    </NavbarItem>
  );
}
