"use client";

import { NavbarContent } from "@nextui-org/navbar";
import { GalleryVerticalEnd } from "lucide-react";
import { Tooltip } from "@nextui-org/react";

import { Button as ButtonSd } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BtnNewChat } from "./btnNewChat";
import { ChatItem } from "./chatItem";

import { Chat, User } from "@/lib/global.types";
import { cn } from "@/lib/utils";

interface LeftBarContentProps {
  smallMenu: boolean;
  user: User | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  chatId: string | undefined;
  chats?: Chat[];
}
export function LeftBarContent({
  smallMenu,
  user,
  chatId,
  chats = [],
  setChats,
}: LeftBarContentProps) {
  return (
    <NavbarContent
      className={cn(
        "w-full flex flex-col gap-4 mt-[230px] text-white transition-all duration-400 ease-in-out"
      )}
      justify="start"
    >
      {/* PARTE DE CIMA */}
      <div className="w-full flex flex-col text-center items-center justify-start truncate gap-4">
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

        {/* BTN NOVA CONVERSA */}
        <BtnNewChat smallMenu={smallMenu} />
      </div>

      {/* CHATS */}
      {!smallMenu && (
        <div className="w-full flex flex-col text-center items-center justify-start truncate gap-4">
          {<Separator className="my-4" />}
          {user && chats?.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              {chats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} setChats={setChats} activeChatId={chatId} />
              ))}
            </div>
          )}
          {chats?.length < 1 && (
            <p className="text-sm ">Suas conversas ficaram aqui.</p>
          )}
        </div>
      )}
    </NavbarContent>
  );
}
